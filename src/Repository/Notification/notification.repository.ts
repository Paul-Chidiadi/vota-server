import {
  Notification,
  INotification,
} from "../../Models/Notification/notification.model";

export default class EventRepository {
  async createNotification(payload: INotification): Promise<INotification> {
    const notification: any = await Notification.create(payload);
    return notification as INotification;
  }
}
