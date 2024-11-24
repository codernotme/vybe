import { Id } from "../../../convex/_generated/dataModel";

// types.ts or wherever your Event type is defined
export interface Event {
  _id: Id<"events">;
  _creationTime: number;
  id?: Id<"events">;
  createdBy?: Id<"users">;
  attendees?: string[] | Id<"users">[];
  description: string;
  title: string;
  date: Date;
  location: string;
}

export interface EventData {
  title: string;
  description: string;
  date: Date;
  location: string;
}