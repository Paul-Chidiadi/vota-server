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

export default class OrganizationService {
  public async getAllOrganization(
    req: any,
    next: NextFunction
  ): Promise<IUser[] | void> {
    const user = req.user;
    if (user) {
      const role = "Organization";
      const organization = await userRepository.findUsersByRole(role);
      if (organization) {
        return organization as IUser[];
      }
      return next(new AppError("Not found", statusCode.notFound()));
    }
    return next(new AppError("Unauthorized access", statusCode.unauthorized()));
  }

  public async getOrganization(
    req: any,
    next: NextFunction
  ): Promise<IUser | void> {
    const user = req.user;
    const { organizationId } = req.params;
    if (user) {
      const organization = await userRepository.findUserById(organizationId);
      if (organization) {
        return organization as IUser;
      }
      return next(new AppError("Oganization not found", statusCode.notFound()));
    }
    return next(new AppError("Unauthorized access", statusCode.unauthorized()));
  }

  public async createEvent(
    req: any,
    next: NextFunction
  ): Promise<IEvent | void> {
    const user = req.user;
    const payload: IEvent = {
      owner: user.id,
      ...req.body,
    };
    const eventData = await eventsRepository.createEvent(payload);
    if (eventData) {
      //if event is created then insert into notification schema and then send a notification
      const notificationPayload: INotification = {
        senderId: user.id,
        notificationType: "Create Event",
        notificationMessage: "Created a new Event",
      };
      const notificationData = await notificationRepository.createNotification(
        notificationPayload
      );
      if (notificationData) {
        return eventData as IEvent;
      }
    }
    return next(new AppError("Failed to create event", statusCode.conflict()));
  }

  public async editEvent(req: any, next: NextFunction): Promise<IEvent | void> {
    const user = req.user;
    const { eventId } = req.params;
    const payload: IEvent = {
      ...req.body,
    };
    const eventData = await eventsRepository.findEventByIdAndUpdate(
      eventId,
      payload
    );
    //if event is edited successfully then insert into notification schema and then send notification
    if (eventData) {
      const notificationPayload: INotification = {
        senderId: user.id,
        notificationType: "Edit Event",
        notificationMessage: "Edited an event",
      };
      const notificationData = await notificationRepository.createNotification(
        notificationPayload
      );
      if (notificationData) {
        return eventData as IEvent;
      }
    }
    return next(new AppError("Failed to edit event", statusCode.conflict()));
  }

  public async cancelEvent(
    req: any,
    next: NextFunction
  ): Promise<IEvent | void> {
    const user = req.user;
    const { eventId } = req.params;
    const eventData = await eventsRepository.deleteEvent(eventId);
    //if event is cancelled successfully then insert into notification schema and then send notification
    if (eventData) {
      const notificationPayload: INotification = {
        senderId: user.id,
        notificationType: "Cancel Event",
        notificationMessage: "Cancelled an event",
      };
      const notificationData = await notificationRepository.createNotification(
        notificationPayload
      );
      if (notificationData) {
        return eventData as IEvent;
      }
    }
    return next(new AppError("Failed to delete event", statusCode.conflict()));
  }

  public async endEvent(req: any, next: NextFunction): Promise<IEvent | void> {
    const user = req.user;
    const { eventId } = req.params;
    const payload: IEvent = {
      status: "history",
    };
    const eventData = await eventsRepository.findEventByIdAndUpdate(
      eventId,
      payload
    );
    //if event is ended successfully then insert into notification schema and then send notification
    if (eventData) {
      const notificationPayload: INotification = {
        senderId: user.id,
        notificationType: "End Event",
        notificationMessage: "Just closed an event",
      };
      const notificationData = await notificationRepository.createNotification(
        notificationPayload
      );
      if (notificationData) {
        return eventData as IEvent;
      }
    }
    return next(new AppError("Failed to end event", statusCode.conflict()));
  }

  public async getAllOrganizationsEvent(
    req: any,
    next: NextFunction
  ): Promise<IEvent | void> {
    const user = req.user;
    const eventData = await eventsRepository.findAllOrganizationsEvent(user.id);
    if (eventData) {
      return eventData as IEvent;
    }
    return next(new AppError("Failed to get events", statusCode.conflict()));
  }

  public async getAllOrganizationsMembers(
    req: any,
    next: NextFunction
  ): Promise<IUser[] | void> {
    const user = req.user;
    const organization = await userRepository.findUserById(user.id);
    const members = organization?.members;
    if (members) {
      return members as unknown as IUser[];
    }
    return next(new AppError("Failed to members", statusCode.conflict()));
  }

  public async addMemberRequest(
    req: any,
    next: NextFunction
  ): Promise<INotification | void> {
    const user = req.user;
    const { memberId } = req.params;
    const organization = await userRepository.findUserById(user.id);
    const members = organization?.members;
    if (members?.includes(memberId)) {
      return next(new AppError("Already a member", statusCode.conflict()));
    }
    const payload: INotification = {
      senderId: user.id,
      recipientId: memberId,
      notificationType: "Add Elector Request",
      notificationMessage: "Wants you to join their Organization",
    };
    const notificationData = await notificationRepository.createNotification(
      payload
    );
    if (notificationData) {
      return notificationData as INotification;
    }
    return next(new AppError("Failed to send request", statusCode.conflict()));
  }

  public async removeMember(
    req: any,
    next: NextFunction
  ): Promise<IUser | void> {
    const user = req.user;
    const { memberId } = req.params;
    const organization = await userRepository.findUserById(user.id);
    const members = organization?.members;
    if (!members?.includes(memberId)) {
      return next(
        new AppError("This User is not your member", statusCode.conflict())
      );
    }
    const deletedMember = await userRepository.removeMember(user.id, memberId);
    //if member is removed successfully then insert into notification schema and then send notification
    if (deletedMember) {
      const notificationPayload: INotification = {
        senderId: user.id,
        recipientId: memberId,
        notificationType: "Remove Member",
        notificationMessage: "Removed you from their organization",
      };
      const notificationData = await notificationRepository.createNotification(
        notificationPayload
      );
      if (notificationData) {
        return deletedMember as IUser;
      }
    }
    return next(new AppError("Failed to remove member", statusCode.conflict()));
  }
}
