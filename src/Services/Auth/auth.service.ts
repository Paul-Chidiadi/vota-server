import { Request, Response, NextFunction } from "express";
import AppError from "../../Utilities/Errors/appError";
import AuthRepository from "../../Repository/Auth/auth.repository";
import UserRepository from "../../Repository/Users/user.repository";
import { IUser } from "../../Models/Users/user.model";
import Utilities, { statusCode } from "../../Utilities/utils";
import { MalierService } from "../Email/mailer";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const util = new Utilities();
const mail = new MalierService();

export default class AuthService {
  public async signUp(req: any, next: NextFunction): Promise<IUser | void> {
    const { companyName, fullName, password, email, confirmPassword, account } = req.body;
    if (password !== confirmPassword) {
      return next(new AppError("password do not match", statusCode.badRequest()));
    }
    const userExist = await userRepository.findUserByEmail(email);
    if (userExist === null) {
      const hashPassword = await util.generateHash(password);
      const { OTP, otpExpiresAt } = await util.generateOtpCode();

      const user: IUser = {
        fullName,
        companyName,
        email,
        password: hashPassword,
        OTP,
        otpExpiresAt,
        role: account,
      };

      const data = await authRepository.signUp(user);
      const newUser = {
        fullName: data.fullName,
        companyName: data.companyName,
        id: data.id,
        email: data.email,
        role: data.role,
        isEmailVerified: data.isEmailVerified,
      };
      if (data) {
        const userInfo = {
          email: data.email,
          subject: "Verify your VOTA Account",
          otp: data.OTP,
        };
        const sentMail = await mail.sendOTP(userInfo);
        if (sentMail) {
          return newUser as IUser;
        }
        return newUser as IUser;
      }
    }
    return next(new AppError("Email address already exist", statusCode.conflict()));
  }

  public async activateUserAccount(req: Request, next: NextFunction): Promise<IUser | void> {
    const { OTP, email } = req.body;
    const user = await userRepository.findUserByCodeAndEmail(email, OTP as number | string);
    const otpExpiresAt = Date.parse(user?.otpExpiresAt as unknown as string);

    if (otpExpiresAt !== undefined && Date.now() > otpExpiresAt) {
      return next(new AppError("Invalid OTP or OTP has expired", statusCode.badRequest()));
    }
    if (user === null) {
      return next(new AppError("Resource for user not found", statusCode.notFound()));
    }
    if (user.OTP !== OTP) {
      return next(new AppError("Invalid otp", statusCode.unauthorized()));
    }
    if (user.isEmailVerified) {
      return next(new AppError("Email already verified", statusCode.unauthorized()));
    }
    const result = await authRepository.activateUserAccount(email);
    if (result) {
      const userInfo = {
        email: result.email,
        subject: "Welcome to VOTA",
      };
      await mail.accountActivationMail(userInfo);
      return user;
    }
  }

  public async resendOTP(req: Request, next: NextFunction): Promise<IUser | void> {
    const { email } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (user === null) {
      return next(new AppError("User not found", statusCode.notFound()));
    }
    const { OTP, otpExpiresAt } = await util.generateOtpCode();

    const result = await authRepository.UpdateOTP(email, OTP, otpExpiresAt);
    const userInfo = {
      email,
      subject: "OTP Verification Code",
      otp: OTP,
    };
    const sentMail = await mail.sendOTP(userInfo);
    if (sentMail) {
      return result as IUser;
    }
    return next(new AppError("Mail not sent, Try again", statusCode.notImplemented()));
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<IUser | void> {
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return next(new AppError("Incorrect Email or password", statusCode.unprocessableEntity()));
    }
    const isActive = await userRepository.isVerified(email);
    if (!isActive) {
      return next(
        new AppError(
          "User account is not active, Kindly activate account",
          statusCode.unauthorized()
        )
      );
    }
    // if user is active then proceed to further operations
    const hashedPassword = await util.comparePassword(password, user.password);
    if (hashedPassword) {
      const { accessToken, refreshToken } = await util.generateToken(user.email);
      // send a mail to the user email on successful login attempt
      res.cookie("jwt", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(statusCode.accepted()).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user,
      });
    } else {
      return next(new AppError("Incorrect password", statusCode.accessForbidden()));
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    const email = req.headers["x-user-email"] as string;
    const token = req.headers["x-user-token"] as string;
    const response = await userRepository.findUserByEmail(email);
    const user = await userRepository.findOneUser(response?.id as unknown as string);
    if (!user) {
      return next(new AppError("User with this email not found", statusCode.notFound()));
    }
    const isValid = await util.verifyToken(email, token);
    if (isValid) {
      const { accessToken, refreshToken } = await util.generateToken(email);
      user.password = "undefined";
      return res.status(200).json({
        accessToken,
        refreshToken,
        data: user,
      });
    }
    return next(
      new AppError("Invalid token. Please login to gain access", statusCode.unauthorized())
    );
  }

  public async forgotPassword(req: Request, next: NextFunction) {
    const { email } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return next(new AppError("User not found", statusCode.notFound()));
    }
    const { OTP, otpExpiresAt } = await util.generateOtpCode();
    const data = {
      email: user.email,
      otp: OTP,
      subject: "Forgot Password Notification",
    };
    // SEND MAIL
    const sendEmail = await mail.forgotPasswordMail(data);
    if (sendEmail) {
      await authRepository.UpdateOTP(email, OTP, otpExpiresAt);
      return user;
    }
    return next(new AppError("Notification failed, try again later", statusCode.noContent()));
  }

  public async resetPassword(req: Request, next: NextFunction) {
    const { newPassword, confirmPassword, OTP, email } = req.body;
    const password =
      newPassword === confirmPassword
        ? newPassword
        : next(new AppError("passwords don't match", statusCode.badRequest()));
    // HASH PASSWORD
    const hashPassword = await util.generateHash(password);
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return next(new AppError("user not found", statusCode.notFound()));
    }
    if (OTP !== String(user.OTP)) {
      return next(new AppError("Invalid OTP", statusCode.badRequest()));
    }
    const otpExpiresAt = Date.parse(user?.otpExpiresAt as unknown as string);
    if (Date.now() > otpExpiresAt) {
      return next(new AppError("Invalid OTP or OTP has expired", statusCode.badRequest()));
    }
    const userData = { hashPassword, email };
    const resetUser: IUser | false = await authRepository.resetPassword(
      userData.email,
      userData.hashPassword
    );

    if (!resetUser) {
      return next(new AppError("Error updating password", statusCode.badRequest()));
    }
    const data = {
      email,
      subject: "Password Reset Notification",
    };
    await mail.resetPasswordMail(data);
    return resetUser;
  }
}
