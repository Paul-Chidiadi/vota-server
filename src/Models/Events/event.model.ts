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
  public?: boolean;
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
    ref: "Organization",
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
      candidateId: Schema.Types.ObjectId,
      ref: "Elector",
      voteCount: Number,
      voters: [],
    },
  ],
  pollQuestions: [
    {
      question: String,
      voteCount: Number,
      voters: [],
    },
  ],
  public: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Event = mongoose.model("Event", eventSchema);
