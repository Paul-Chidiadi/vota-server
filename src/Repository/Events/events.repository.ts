import { Event, IEvent } from "../../Models/Events/events.model";
import { ref, set, update, remove } from "firebase/database";
import firebaseDB from "../../firebase-config";

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
    }).exec();
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

  // FIREBASE REPOSITORY SECTION
  async firebaseInsertEvent(eventData: IEvent): Promise<IEvent | void> {
    const eventsRef = ref(firebaseDB, `events/${eventData.id?.toString()}`);
    const result = await set(eventsRef, {
      id: eventData.id,
      owner: eventData.owner?.toString(),
      eventName: String(eventData.eventName),
      eventType: String(eventData.eventType),
      schedule: eventData.schedule,
      status: eventData.status,
      positions: eventData.positions,
      candidates: JSON.stringify(eventData.candidates),
      pollQuestions: JSON.stringify(eventData.pollQuestions),
      isPublic: eventData.isPublic,
    });
    return result;
  }

  async firebaseUpdateEvent(
    eventId: string,
    eventData: IEvent
  ): Promise<IEvent | void> {
    const updateEventsRef: any = ref(
      firebaseDB,
      `events/${eventId?.toString()}`
    );
    try {
      // Use the update method to modify specific properties
      const result = await update(updateEventsRef, {
        id: eventData.id,
        owner: eventData.owner?.toString(),
        eventName: String(eventData.eventName),
        eventType: String(eventData.eventType),
        schedule: eventData.schedule,
        status: eventData.status,
        positions: eventData.positions,
        candidates: JSON.stringify(eventData.candidates),
        pollQuestions: JSON.stringify(eventData.pollQuestions),
        isPublic: eventData.isPublic,
      });
      return result;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async firebaseDeleteEvent(eventId: string): Promise<IEvent | void> {
    const eventsRef = ref(firebaseDB, `events/${eventId?.toString()}`);
    try {
      // Use the remove method to delete the specific event
      await remove(eventsRef);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}
