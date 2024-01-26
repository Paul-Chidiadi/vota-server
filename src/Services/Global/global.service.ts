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

export default class GLobalService {
  public async editProfile(
    req: any,
    next: NextFunction
  ): Promise<IUser | void> {
    const user = req.user;
    const {
      companyName,
      fullName,
      position,
      phoneNumber,
      address,
      numberOfStaff,
      location,
    } = req.body;

    const payload: any = {
      companyName,
      fullName,
      position,
      phoneNumber,
      address,
      numberOfStaff,
      location,
    };
    const result = await userRepository.findUserByIdAndUpdate(
      user._id,
      payload
    );
    if (result) {
      return result as IUser;
    }
    return next(
      new AppError("Failed update, Try again", statusCode.conflict())
    );
  }

  public async editPassword(
    req: any,
    next: NextFunction
  ): Promise<IUser | void> {
    const user = req.user;
    const { email, newPassword, confirmPassword, OTP } = req.body;
    const passwordValue =
      newPassword === confirmPassword
        ? newPassword
        : next(new AppError("passwords don't match", statusCode.badRequest()));
    // HASH PASSWORD
    const hashPassword = await util.generateHash(passwordValue);
    const result = await userRepository.findUserById(user._id);
    if (!result) {
      return next(new AppError("user not found", statusCode.notFound()));
    }
    if (OTP !== String(result.OTP)) {
      return next(new AppError("Invalid OTP", statusCode.badRequest()));
    }
    const otpExpiresAt = Date.parse(result?.otpExpiresAt as unknown as string);
    if (Date.now() > otpExpiresAt) {
      return next(
        new AppError("Invalid OTP or OTP has expired", statusCode.badRequest())
      );
    }
    const userData = { hashPassword, email };
    const resetUser: IUser | false = await authRepository.resetPassword(
      userData.email,
      userData.hashPassword
    );

    if (!resetUser) {
      return next(
        new AppError("Error updating password", statusCode.badRequest())
      );
    }
    const data = {
      email,
      subject: "Password Change Notification",
    };
    // await mail.resetPasswordMail(data);
    return resetUser;
  }

  public async editEmail(req: any, next: NextFunction): Promise<IUser | void> {
    const user = req.user;
    const { email, OTP } = req.body;
    const userData = await userRepository.findUserById(user._id);
    if (!userData) {
      return next(new AppError("user not found", statusCode.notFound()));
    }
    if (OTP !== String(userData.OTP)) {
      return next(new AppError("Invalid OTP", statusCode.badRequest()));
    }
    const payload: any = { email };
    const result = await userRepository.findUserByIdAndUpdate(
      user._id,
      payload
    );
    if (result) {
      return result as IUser;
    }
    return next(
      new AppError("Email update failed, Try again", statusCode.conflict())
    );
  }
}
