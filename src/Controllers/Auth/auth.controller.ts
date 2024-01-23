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
