import mongoose, { Schema, ObjectId } from "mongoose";

export interface IUser {
  id?: string;
  password: string;
  email: string;
  fullName?: string;
  companyName?: string;
  OTP?: number | string;
  otpExpiresAt?: number;
  isEmailVerified?: boolean;
  createdAt?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  displayPicture?: string | undefined;
  displayPictureId?: string | undefined;
  logo?: string | undefined;
  logoId?: string | undefined;
  position?: string;
  location?: string;
  organizations?: string[];
  members?: string[];
  numberOfStaff?: number;
  eventsConducted?: number;
  eventsEngaged?: number;
  eventsOngoing?: number;
}

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
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
  logo: {
    type: String,
  },
  logoId: {
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
      ref: "User",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  numberOfStaff: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Elector", "Organization", "Admin"],
  },
  eventsEngaged: {
    type: Number,
  },
  eventsConducted: {
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

export const User = mongoose.model("User", userSchema);
