import mongoose, { Schema, ObjectId } from "mongoose";

export interface IElector {
  id?: string;
  password: string;
  email: string;
  fullName?: string;
  OTP?: number | string;
  otpExpiresAt?: number;
  isEmailVerified?: boolean;
  createdAt?: string;
  role?: string;
  phoneNumber?: string;
  organizations?: string[];
  displayPicture?: string | undefined;
  displayPictureId?: string | undefined;
  location?: string;
  position?: string;
  eventsEngaged?: number;
  eventsOngoing?: number;
}

const electorSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  displayPicture: {
    type: String,
  },
  displayPictureId: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "An email must be provided"],
    unique: true,
    lowercase: true,
  },
  position: {
    type: String,
  },
  organizations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  location: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Elector", "Organization", "Admin"],
    default: "Elector",
  },
  eventsEngaged: {
    type: Number,
  },
  eventsOngoing: {
    type: Number,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  OTP: {
    type: Number,
  },
  otpExpiresAt: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Elector = mongoose.model("Elector", electorSchema);
