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
    const { companyName, fullName, password, email, confirmPassword, account } =
      req.body;
    if (password !== confirmPassword) {
      return next(
        new AppError("password do not match", statusCode.badRequest())
      );
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
        // const userInfo = {
        //   email: data.email,
        //   subject: "Verify your VOTA Account",
        //   otp: data.OTP,
        // };
        // await mail.sendOTP(userInfo);
        return newUser as IUser;
      }
    }
    return next(
      new AppError("Email address already exist", statusCode.conflict())
    );
  }
}
