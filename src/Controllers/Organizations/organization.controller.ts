import { Request, Response, NextFunction } from "express";
import OrganizationService from "../../Services/Organizations/organization.service";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const organizationService = new OrganizationService();

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await organizationService.createEvent(req, next);
    if (event) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Event successfully Created",
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

export const editEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await organizationService.editEvent(req, next);
    if (event) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Event updated successfully",
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

export const cancelEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await organizationService.cancelEvent(req, next);
    if (event) {
      return res.status(statusCode.ok()).json({
        status: "success",
        message: "Event cancelled successfully",
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

export const endEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await organizationService.endEvent(req, next);
    if (event) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Event cancelled successfully",
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

export const getAllOrganizationsEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await organizationService.getAllOrganizationsEvent(req, next);
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

export const getAllOrganizationsMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await organizationService.getAllOrganizationsMembers(
      req,
      next
    );
    if (members) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Successful",
        members,
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

export const addMemberRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const member = await organizationService.addMemberRequest(req, next);
    if (member) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Request successfully sent",
        member,
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

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const member = await organizationService.removeMember(req, next);
    if (member) {
      return res.status(statusCode.ok()).json({
        status: "success",
        message: "Member removed successfully",
        member,
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
