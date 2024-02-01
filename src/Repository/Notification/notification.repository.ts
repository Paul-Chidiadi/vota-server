import {
  Notification,
  INotification,
} from "../../Models/Notification/notification.model";

export default class EventRepository {
  async createNotification(payload: INotification): Promise<INotification> {
    const notification: any = await Notification.create(payload);
    return notification as INotification;
  }

  async findOneNotification(id: string): Promise<INotification | null> {
    const user: any = await Notification.findOne({ _id: id })
      .lean()
      .select("-__v");
    return user as INotification;
  }

  async findNotificationByIdAndUpdate(
    id: string,
    payload: INotification
  ): Promise<INotification | null> {
    const notification: any = await Notification.findByIdAndUpdate(
      { _id: id },
      payload,
      {
        new: true,
      }
    )
      .select("-__v")
      .exec();
    return notification as INotification;
  }
}
