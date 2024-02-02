import mongoose, { Schema, ObjectId } from "mongoose";

export interface IEvent {
  id?: string;
  owner?: string;
  eventName?: string;
  eventType?: string;
  schedule?: string;
  status?: string;
  positions?: string[];
  candidates?: Candidate[];
  pollQuestions?: PollQuestion[];
  isPublic?: boolean;
}

interface Candidate {
  runfor: string;
  candidateId: string;
  voteCount: number;
  voters: string[];
}

interface PollQuestion {
  question: string;
  voteCount: number;
  voters: string[];
}

const eventSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  eventName: {
    type: String,
  },
  eventType: {
    type: String,
  },
  schedule: {
    type: String,
  },
  status: {
    type: String,
    enum: ["history", "future", "ongoing"],
    default: "future",
  },
  positions: [
    {
      type: String,
    },
  ],
  candidates: [
    {
      runfor: String,
      candidateId: { type: Schema.Types.ObjectId, ref: "User" },
      voteCount: { type: Number, default: 0 },
      voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  pollQuestions: [
    {
      question: String,
      voteCount: { type: Number, default: 0 },
      voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  isPublic: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Event = mongoose.model("Event", eventSchema);
