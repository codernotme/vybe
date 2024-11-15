// convex/anonymousChat.ts
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation(async ({ db }, { text, userId }) => {
  const message = {
    text,
    userId,
    timestamp: Date.now(),
  };
  await db.insert("anonymousChat", message);
});

export const getMessages = query(async ({ db }) => {
  return await db
    .query("anonymousChat")
    .withIndex("by_timestamp")
    .order("timestamp", "desc")
    .collect();
});
