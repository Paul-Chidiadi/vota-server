import { Request, Response, NextFunction } from "express";
import GlobalService from "../../Services/Global/global.service";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const globalService = new GlobalService();

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await globalService.editProfile(req, next);
    if (user) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Profile successfully Updated",
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

export const editPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await globalService.editPassword(req, next);
    if (user) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Password successfully Updated",
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

export const editEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await globalService.editEmail(req, next);
    if (user) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Email successfully Updated",
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

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await globalService.getEvent(req, next);
    if (event) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Successful",
        event,
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
