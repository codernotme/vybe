import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Mutation to create a new event
export const createEvent = mutation({
  args: v.object({
    title: v.string(),
    description: v.string(),
    date: v.string(),
    location: v.string(),
  }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    // If no identity is found, throw an unauthorized error
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const eventData = { ...args, createdBy: identity.userId as Id<"users"> };
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
    return await db.get(eventId);
  },
});

// Mutation to update an event
export const updateEvent = mutation({
  args: v.object({
    eventId: v.id("events"),
    updateData: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      date: v.optional(v.string()),
      location: v.optional(v.string()),
    }),
  }),
  handler: async ({ db }, { eventId, updateData }) => {
    await db.patch(eventId, updateData);
    return eventId;
  },
});

// Mutation to delete an event
export const deleteEvent = mutation({
  args: v.object({ eventId: v.id("events") }),
  handler: async ({ db }, { eventId }) => {
    await db.delete(eventId);
    return eventId;
  },
});
