import { mutation, query } from "../_generated/server";

// Mutation to create a new event
export const createEvent = mutation(async ({ db, auth }, eventData) => {
  const userId = auth.userId;
  if (!userId) throw new Error("User not authenticated");

  const eventId = await db.insert("events", { ...eventData, createdBy: userId });
  return eventId;
});

// Query to fetch all events
export const getEvents = query(async ({ db }) => {
  return await db.query("events").collect();
});

// Query to fetch event details by ID
export const getEventById = query(async ({ db }, { eventId }) => {
  return await db.get("events", eventId);
});

// Mutation to update an event
export const updateEvent = mutation(async ({ db }, { eventId, updateData }) => {
  await db.patch("events", eventId, updateData);
  return eventId;
});

// Mutation to delete an event
export const deleteEvent = mutation(async ({ db }, { eventId }) => {
  await db.delete("events", eventId);
  return eventId;
});
