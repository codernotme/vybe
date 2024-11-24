import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Mutation to create a new event
export const createEvent = mutation({
  args: v.object({
    title: v.string(),
    description: v.string(),
    date: v.number(),
    location: v.string(),
  }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const userId = identity.id as Id<"users">;
    const user = await db.get(userId);

    if (!user || (user.role !== "community" && user.role !== "mentor")) {
      throw new ConvexError("Unauthorized");
    }

    const eventData = { ...args, date: args.date, createdBy: userId, attendees: [] };
    const eventId = await db.insert("events", eventData);
    return eventId;
  },
});

// Query to fetch all events
export const getEvents = query({
  handler: async ({ db }) => {
    return await db.query("events").collect();
  },
});

// Query to fetch event details by ID
export const getEventById = query({
  args: v.object({ eventId: v.id("events") }),
  handler: async ({ db }, { eventId }) => {
    const event = await db.get(eventId);
    if (!event) {
      throw new ConvexError("Event not found");
    }
    return event;
  },
});

// Mutation to update an event
export const updateEvent = mutation({
  args: v.object({
    eventId: v.id("events"),
    updateData: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      date: v.optional(v.number()),
      location: v.optional(v.string()),
    }),
  }),
  handler: async ({ db }, { eventId, updateData }) => {
    const existingEvent = await db.get(eventId);
    if (!existingEvent) {
      throw new ConvexError("Event not found");
    }

    await db.patch(eventId, updateData);
    return eventId;
  },
});

// Mutation to delete an event
export const deleteEvent = mutation({
  args: v.object({ eventId: v.id("events") }),
  handler: async ({ db, auth }, { eventId }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const event = await db.get(eventId);

    if (!event || event.createdBy !== identity.id) {
      throw new ConvexError("Unauthorized");
    }

    await db.delete(eventId);
    return eventId;
  },
});

// Mutation to delete events created by demoted users
export const deleteEventsByUser = mutation({
  args: v.object({ userId: v.id("users") }),
  handler: async ({ db }, { userId }) => {
    const events = await db.query("events").withIndex("by_createdBy", q => q.eq("createdBy", userId)).collect();
    for (const event of events) {
      await db.delete(event._id);
    }
  },
});

// Mutation to enroll in an event
export const enrollEvent = mutation({
  args: v.object({ eventId: v.id("events") }),
  handler: async ({ db, auth }, { eventId }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const userId = identity.id as Id<"users">;
    const user = await db.get(userId);

    if (!user || !('role' in user) || (user.role !== "member" && user.role !== "tech")) {
      throw new ConvexError("Unauthorized");
    }

    const event = await db.get(eventId);

    if (!event) {
      throw new ConvexError("Event not found");
    }

    const attendees: Id<"users">[] = (event.attendees || []);

    if (!attendees.includes(identity.id as Id<"users">)) {
      await db.patch(eventId, {
        attendees: [...attendees, identity.id as Id<"users">]
      });
    }

    return eventId;
  },
});
