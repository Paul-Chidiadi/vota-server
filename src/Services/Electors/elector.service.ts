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
      //GET ELECTORS ORGANIZATIONS
      const organizations: any = elector?.organizations;
      let eventData: any = [];
      if (organizations) {
        //LOOP THROUGH ORGANIZATIONS ARRAY AND GET THEIR EVENTS EACH
        for (let org = 0; org < organizations.length; org++) {
          const organizationId = organizations[org];
          const arrayOfEvents =
            await eventsRepository.findAllOrganizationsEvent(organizationId);
          if (!arrayOfEvents) {
            return next(
              new AppError("Failed to get events", statusCode.conflict())
            );
          }
          eventData.push(...arrayOfEvents);
        }
      }
      if (elector) {
        return { elector, eventData } as any;
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

  public async joinOrganizationRequest(
    req: any,
    next: NextFunction
  ): Promise<INotification | void> {
    const user = req.user;
    const { organizationId } = req.params;
    const elector = await userRepository.findUserById(user.id);
    const organizations = elector?.organizations;
    if (organizations?.includes(organizationId)) {
      return next(new AppError("Joined Already", statusCode.conflict()));
    }
    const payload: INotification = {
      senderId: user.id,
      recipientId: organizationId,
      notificationType: "Join Organization Request",
      notificationMessage: "Wants to join your Organization",
    };
    const notificationData = await notificationRepository.createNotification(
      payload
    );
    if (notificationData) {
      return notificationData as INotification;
    }
    return next(new AppError("Failed to send request", statusCode.conflict()));
  }

  public async leaveOrganization(
    req: any,
    next: NextFunction
  ): Promise<IUser | void> {
    const user = req.user;
    const { organizationId } = req.params;
    const elector = await userRepository.findUserById(user.id);
    const organizations = elector?.organizations;
    if (organizations?.includes(organizationId)) {
      // Remove organization from elector's organizations list
      const deleteOrganization = await userRepository.removeOrganization(
        user.id,
        organizationId
      );
      // Remove member from organization's members list
      const deletedMember = await userRepository.removeMember(
        organizationId,
        user.id
      );
      //if organization is left successfully then insert into notification schema and then send notification
      if (deleteOrganization && deletedMember) {
        const notificationPayload: INotification = {
          senderId: user.id,
          recipientId: organizationId,
          notificationType: "Leave Organization",
          notificationMessage: "Left your Organization",
        };
        const notificationData =
          await notificationRepository.createNotification(notificationPayload);
        if (notificationData) {
          return deletedMember as IUser;
        }
      }
      return next(
        new AppError("Failed to leave organization", statusCode.conflict())
      );
    }
    return next(
      new AppError(
        "You are not part of this organization",
        statusCode.conflict()
      )
    );
  }

  public async ignoreRequest(
    req: any,
    next: NextFunction
  ): Promise<INotification | void> {
    const user = req.user;
    const { notificationId } = req.params;
    //Get Details of this notification
    const notification = await notificationRepository.findOneNotification(
      notificationId
    );
    if (!notification) {
      return next(
        new AppError("Notification doesn't exist", statusCode.notFound())
      );
    }
    const payload: INotification = {
      senderId: notification.senderId,
      isSettled: true,
    };
    const updatedNotification =
      await notificationRepository.findNotificationByIdAndUpdate(
        notificationId,
        payload
      );
    if (updatedNotification) {
      return updatedNotification;
    }
    return next(
      new AppError("Failed to ignore request", statusCode.conflict())
    );
  }

  public async acceptRequest(
    req: any,
    next: NextFunction
  ): Promise<INotification | void> {
    const user = req.user;
    const { notificationId } = req.params;
    //Get Details of this notification
    const notification = await notificationRepository.findOneNotification(
      notificationId
    );
    if (!notification) {
      return next(
        new AppError("Notification doesn't exist", statusCode.notFound())
      );
    }
    if (notification.notificationType !== "Add Elector Request") {
      return next(
        new AppError("This Request is wrong", statusCode.badRequest())
      );
    }
    if (notification.isSettled === true) {
      return next(
        new AppError("Notification is Settled", statusCode.badRequest())
      );
    }
    // Add organization to elector's organizations list
    const addOrganization = await userRepository.addOrganization(
      user.id,
      notification.senderId
    );
    if (!addOrganization) {
      return next(
        new AppError(
          "Couldn't accept Organization",
          statusCode.notImplemented()
        )
      );
    }
    // Add member to organization's members list
    const addMember = await userRepository.addMember(
      notification.senderId,
      user.id
    );
    if (!addMember) {
      // if Add member is not successful then remove organization back
      const removeOrganization = await userRepository.removeOrganization(
        user.id,
        notification.senderId
      );
      return next(
        new AppError("Couldn't accept Organization", statusCode.badRequest())
      );
    }
    //If we have successfully added both organization and members into each others document then create notifications
    const notificationPayload: INotification = {
      senderId: user.id,
      recipientId: notification.senderId,
      notificationType: "Accept Request",
      notificationMessage: "Accepted request to become your member",
    };
    const notificationData = await notificationRepository.createNotification(
      notificationPayload
    );
    if (notificationData) {
      const payload: INotification = {
        senderId: notification.senderId,
        isSettled: true,
      };
      const updatedNotification =
        await notificationRepository.findNotificationByIdAndUpdate(
          notificationId,
          payload
        );
      if (updatedNotification) {
        return updatedNotification;
      }
    }
  }

  public async vote(req: any, next: NextFunction): Promise<IEvent | void> {
    const user = req.user;
    const { eventId } = req.params;
    const { positionId, questionId } = req.body;
    const eventData: any = await eventsRepository.findOneEvent(eventId);
    if (!eventData) {
      return next(new AppError("Event doesn't exist", statusCode.notFound()));
    }
    //IF THE EVENT TYPE IS A POLL
    if (
      eventData.eventType === "Poll" &&
      eventData.pollQuestions &&
      eventData.pollQuestions.length > 0
    ) {
      //GET PARTICULAR QUESTION ID IN THE POLLQUESTIONS ARRAY
      const questionBeingVotedFor = eventData.pollQuestions.filter(
        (item: any) => {
          return item._id.toString() === questionId;
        }
      );
      const questionTitle = questionBeingVotedFor[0].question;
      const numberOfVotes = questionBeingVotedFor[0].voteCount;
      const votersArray = questionBeingVotedFor[0].voters;
      const includesUserInformation = eventData.pollQuestions.some((obj: any) =>
        obj.voters.some((voter: any) => voter._id.toString() === user.id)
      );
      if (includesUserInformation) {
        return next(
          new AppError("Vote already casted", statusCode.badRequest())
        );
      }
      const payload: any = {
        question: questionTitle,
        voters: [...votersArray, user.id],
        voteCount: Number(numberOfVotes) + 1,
      };
      const updatedPollQuestion = await eventsRepository.updatePollQuestion(
        eventId,
        questionId,
        payload
      );
      if (updatedPollQuestion) {
        //ENABLE FIREBASE PUSH NOTIFICATIONS
        return updatedPollQuestion as any;
      }
    }

    //IF THE EVENT TYPE IS A ELECTION
    if (
      eventData.eventType === "Election" &&
      eventData.candidates &&
      eventData.candidates.length > 0
    ) {
      //GET PARTICULAR POSITION ID IN THE CANDIDATE ARRAY
      const candidateBeingVotedFor = eventData.candidates.filter(
        (item: any) => {
          return item._id.toString() === positionId;
        }
      );
      const runfor = candidateBeingVotedFor[0].runfor;
      const candidateId = candidateBeingVotedFor[0].candidateId;
      const numberOfVotes = candidateBeingVotedFor[0].voteCount;
      const votersArray = candidateBeingVotedFor[0].voters;

      //CHECK IF USER HAS VOTED ALREADY
      const hasVoted = eventData.candidates
        .filter((obj: any) => obj.runfor === runfor)
        .some((obj: any) =>
          obj.voters.some((voter: any) => voter._id.toString() === user.id)
        );
      if (hasVoted) {
        return next(
          new AppError(
            `Vote already casted for ${runfor}`,
            statusCode.badRequest()
          )
        );
      }
      const payload: any = {
        runfor: runfor,
        candidateId: candidateId,
        voters: [...votersArray, user.id],
        voteCount: Number(numberOfVotes) + 1,
      };
      const updatedCandidate = await eventsRepository.updateCandidate(
        eventId,
        positionId,
        payload
      );
      if (updatedCandidate) {
        //ENABLE FIREBASE PUSH NOTIFICATIONS
        return updatedCandidate as any;
      }
    }

    return next(
      new AppError(`Couldn't cast vote`, statusCode.notImplemented())
    );
  }
}
