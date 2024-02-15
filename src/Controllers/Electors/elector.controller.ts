import { Request, Response, NextFunction } from "express";
import ElectorService from "../../Services/Electors/elector.service";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const electorService = new ElectorService();

export const getAllElector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const elector = await electorService.getAllElector(req, next);
    if (elector) {
      return res.status(statusCode.created()).json({
        success: true,
        message: "Successful",
        data: elector,
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

export const getElector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const elector = await electorService.getElector(req, next);
    if (elector) {
      return res.status(statusCode.created()).json({
        success: true,
        message: "Successful",
        data: elector,
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

export const getAllElectorsOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await electorService.getAllElectorsOrganization(
      req,
      next
    );
    if (organizations) {
      return res.status(statusCode.created()).json({
        success: true,
        message: "Successful",
        data: organizations,
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

export const getAllElectorsEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await electorService.getAllElectorsEvent(req, next);
    if (event) {
      return res.status(statusCode.created()).json({
        success: true,
        message: "Successful",
        data: event,
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

export const joinOrganizationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await electorService.joinOrganizationRequest(req, next);
    if (result) {
      return res.status(statusCode.created()).json({
        success: true,
        message: "Request successfully sent",
        data: result,
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

export const leaveOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await electorService.leaveOrganization(req, next);
    if (result) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "You left successfully",
        data: result,
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

export const ignoreRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedNotification = await electorService.ignoreRequest(req, next);
    if (updatedNotification) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "Succesful",
        data: updatedNotification,
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

export const acceptRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedNotification = await electorService.acceptRequest(req, next);
    if (updatedNotification) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "Succesful",
        data: updatedNotification,
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

export const vote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await electorService.vote(req, next);
    if (event) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "Succesful",
        data: event,
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

export const uploadProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await electorService.uploadProfileImage(req, next);
    if (user) {
      return res.status(statusCode.ok()).json({
        success: true,
        message: "Succesful",
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
