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
        success: true,
        message: "Signup successful, Check email for activation code",
        data: user,
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
        message: "Email verification successful, login to continue",
        data: result,
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
        data: result,
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
    if (result) {
      return res.status(statusCode.accepted()).json({
        success: true,
        message: "Login Successful",
        data: result,
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

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verifiedToken = await authService.refreshToken(req, res, next);
    if (verifiedToken) {
      return res.status(statusCode.accepted()).json({
        success: true,
        message: "Token Refreshed",
        data: verifiedToken,
      });
    }
  } catch (error) {
    return next(
      new AppError(
        `something went wrong here is the error ${error}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.forgotPassword(req, next);
    if (user) {
      return res.status(statusCode.accepted()).json({
        success: true,
        message: "password reset code sent to your email.",
        data: user,
      });
    }
  } catch (error) {
    return next(
      new AppError(
        `something went wrong here is the error ${error}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.resetPassword(req, next);
    if (result) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "Password reset successful",
        data: result,
      });
    }
  } catch (error) {
    return next(
      new AppError(
        `something went wrong here is the error ${error}`,
        statusCode.internalServerError()
      )
    );
  }
};
