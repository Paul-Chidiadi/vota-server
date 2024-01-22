import mongoose, { Schema, ObjectId } from "mongoose";

export interface IOrganization {
  id?: string;
  password: string;
  email: string;
  companyName?: string;
  OTP?: number | string;
  otpExpiresAt?: number;
  isEmailVerified?: boolean;
  createdAt?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  logo?: string | undefined;
  logoId?: string | undefined;
  location?: string;
  members?: string[];
  numberOfStaff?: number;
  eventsConducted?: number;
  eventsOngoing?: number;
}

const organizationSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  phoneNumber: {
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
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Elector",
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
    default: "Organization",
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

export const Organization = mongoose.model("Organization", organizationSchema);
