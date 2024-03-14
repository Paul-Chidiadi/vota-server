import mongoose, { Schema, ObjectId } from "mongoose";

export interface INotification {
  id?: string;
  senderId: string;
  recipientId?: string;
  notificationType?: string;
  notificationMessage?: string;
  isSettled?: boolean;
  info?: any;
}

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  notificationType: {
    type: String,
  },
  notificationMessage: {
    type: String,
  },
  isSettled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
