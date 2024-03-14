import { Notification, INotification } from "../../Models/Notification/notification.model";
import { ref, set, update } from "firebase/database";
import firebaseDB from "../../firebase-config";

export default class EventRepository {
  async createNotification(payload: INotification): Promise<INotification> {
    const notification: any = await Notification.create(payload);
    const populatedNotification = await Notification.findById(notification._id).populate(
      "senderId"
    );
    return populatedNotification as any;
  }

  async findOneNotification(id: string): Promise<INotification | null> {
    const notification: any = await Notification.findOne({ _id: id }).lean().select("-__v");
    return notification as INotification;
  }

  async findNotificationByIdAndUpdate(
    id: string,
    payload: INotification
  ): Promise<INotification | null> {
    const notification: any = await Notification.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    })
      .select("-__v")
      .populate("senderId")
      .exec();
    return notification as INotification;
  }

  // FIREBASE REPOSITORY SECTION
  async firebaseInsertNotification(notificationData: INotification): Promise<INotification | void> {
    const notificationsRef = ref(firebaseDB, `notifications/${notificationData.id?.toString()}`);
    const result = await set(notificationsRef, {
      id: notificationData.id,
      senderId: String(notificationData.senderId),
      recipientId: String(notificationData.recipientId),
      notificationType: notificationData.notificationType,
      notificationMessage: notificationData.notificationMessage,
      isSettled: notificationData.isSettled,
    });
    return result;
  }

  async firebaseUpdateNotification(notificationId: string): Promise<INotification | void> {
    const updateNotificationsRef: any = ref(
      firebaseDB,
      `notifications/${notificationId?.toString()}`
    );
    try {
      // Use the update method to modify specific properties
      const result = await update(updateNotificationsRef, { isSettled: true });
      return result;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }
}
