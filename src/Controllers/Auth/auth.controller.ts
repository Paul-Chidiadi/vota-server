import { Request, Response, NextFunction } from "express";
import AuthService from "../../Services/Auth/auth.service";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const authService = new AuthService();

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.signUp(req, next);
    if (user) {
      return res.status(statusCode.created()).json({
        status: "success",
        message:
          "Account successfully created, Check your mail for activation code",
        user,
      });
    }
  } catch (err) {
    return next(
      new AppError(
        `something went wrong ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const activateUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.activateUserAccount(req, next);
    if (result) {
      return res.status(statusCode.accepted()).json({
        success: true,
        message: "Email verification successful, please login to continue",
      });
    }
  } catch (err) {
    return next(
      new AppError(
        `something went wrong here is the error ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.resendOTP(req, next);
    if (result) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "OTP sent successful, please check your email",
      });
    }
  } catch (err) {
    return next(
      new AppError(
        `something went wrong here is the error ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req, res, next);
    return result;
  } catch (err) {
    return next(
      new AppError(
        `something went wrong here is the error ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};
