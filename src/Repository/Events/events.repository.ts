import { Event, IEvent } from "../../Models/Events/events.model";

export default class EventRepository {
  async createEvent(payload: IEvent): Promise<IEvent> {
    const event: any = await Event.create(payload);
    return event as IEvent;
  }

  async findEvents(): Promise<IEvent[] | null> {
    const events = await Event.find();
    return events as any;
  }
  async findOneEvent(id: string): Promise<IEvent | null> {
    const event: any = await Event.findOne({ _id: id }).lean().select("-__v");
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
    const events = await Event.find({ owner: ownerId });
    return events as any;
  }
}
