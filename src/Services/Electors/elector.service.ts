import { Request, Response, NextFunction } from "express";
import AppError from "../../Utilities/Errors/appError";
import UserRepository from "../../Repository/Users/user.repository";
import EventRepository from "../../Repository/Events/events.repository";
import NotificationRepository from "../../Repository/Notification/notification.repository";
import { IUser } from "../../Models/Users/user.model";
import Utilities, { statusCode } from "../../Utilities/utils";
import { MalierService } from "../Email/mailer";
import { IEvent } from "../../Models/Events/events.model";
import { INotification } from "../../Models/Notification/notification.model";

const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();
const eventsRepository = new EventRepository();
const util = new Utilities();
const mail = new MalierService();

export default class ElectorService {
  public async getAllElector(
    req: any,
    next: NextFunction
  ): Promise<IUser[] | void> {
    const user = req.user;
    if (user) {
      const role = "Elector";
      const elector = await userRepository.findUsersByRole(role);
      if (elector) {
        return elector as IUser[];
      }
      return next(new AppError("Not found", statusCode.notFound()));
    }
    return next(new AppError("Unauthorized access", statusCode.unauthorized()));
  }

  public async getElector(req: any, next: NextFunction): Promise<IUser | void> {
    const user = req.user;
    const { electorId } = req.params;
    if (user) {
      const elector = await userRepository.findUserById(electorId);
      if (elector) {
        return elector as IUser;
      }
      return next(new AppError("Elector not found", statusCode.notFound()));
    }
    return next(new AppError("Unauthorized access", statusCode.unauthorized()));
  }

  public async getAllElectorsOrganization(
    req: any,
    next: NextFunction
  ): Promise<IUser[] | void> {
    const user = req.user;
    const elector = await userRepository.findUserById(user.id);
    const organizations = elector?.organizations;
    if (organizations) {
      return organizations as unknown as IUser[];
    }
    return next(new AppError("Failed to organizations", statusCode.conflict()));
  }

  public async getAllElectorsEvent(
    req: any,
    next: NextFunction
  ): Promise<IEvent | void> {
    const user = req.user;
    //GET ELECTORS ORGANIZATIONS
    const elector = await userRepository.findUserById(user.id);
    const organizations: any = elector?.organizations;
    let eventData: any = [];
    if (organizations) {
      //LOOP THROUGH ORGANIZATIONS ARRAY AND GET THEIR EVENTS EACH
      for (let org = 0; org < organizations.length; org++) {
        const organizationId = organizations[org];
        const arrayOfEvents = await eventsRepository.findAllOrganizationsEvent(
          organizationId
        );
        if (!arrayOfEvents) {
          return next(
            new AppError("Failed to get events", statusCode.conflict())
          );
        }
        eventData.push(...arrayOfEvents);
      }
      if (eventData) {
        return eventData as IEvent;
      }
    }
    return eventData;
  }
}
