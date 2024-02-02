import { Event, IEvent } from "../../Models/Events/events.model";

export default class EventRepository {
  async createEvent(payload: IEvent): Promise<IEvent> {
    const event: any = await Event.create(payload);
    return event as IEvent;
  }

  async findEvents(): Promise<IEvent[] | null> {
    const events = await Event.find().populate("owner").populate("candidates");
    return events as any;
  }
  async findOneEvent(id: string): Promise<IEvent | null> {
    const event: any = await Event.findOne({ _id: id })
      .lean()
      .select("-__v")
      .populate("owner")
      .populate("candidates.candidateId")
      .populate("pollQuestions.voters");
    return event as IEvent;
  }

  async findEventByIdAndUpdate(
    id: string,
    payload: IEvent
  ): Promise<IEvent | null> {
    const event: any = await Event.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    })
      .select("*")
      .exec();
    return event as IEvent;
  }

  async deleteEvent(eventId: string): Promise<IEvent> {
    const event: any = await Event.findByIdAndDelete({ _id: eventId });
    return event as IEvent;
  }

  async findAllOrganizationsEvent(ownerId: string): Promise<IEvent[]> {
    const events = await Event.find({ owner: ownerId })
      .populate("owner")
      .populate("candidates.candidateId")
      .populate("pollQuestions.voters");
    return events as any;
  }

  async updatePollQuestion(
    eventId: string,
    questionId: string,
    payload: any
  ): Promise<IEvent[]> {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, "pollQuestions._id": questionId },
      {
        $set: {
          "pollQuestions.$.question": payload.question,
          "pollQuestions.$.voters": payload.voters,
          "pollQuestions.$.voteCount": payload.voteCount,
        },
      },
      { new: true }
    );
    return event as any;
  }

  async updateCandidate(
    eventId: string,
    positionId: string,
    payload: any
  ): Promise<IEvent[]> {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, "candidates._id": positionId },
      {
        $set: {
          "candidates.$.runfor": payload.runfor,
          "candidates.$.candidateId": payload.candidateId,
          "candidates.$.voteCount": payload.voteCount,
          "candidates.$.voters": payload.voters,
        },
      },
      { new: true }
    );
    return event as any;
  }
}
