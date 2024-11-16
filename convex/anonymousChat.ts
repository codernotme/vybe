import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to fetch all chat messages
export const getMessages = query(async ({ db }) => {
  return await db.query("anonymousChat").order("desc").collect();
});

// Query to fetch a random online user with the role "member" or "tech"
export const getRandomUser = query({
  args: { role: v.optional(v.string()) },
  handler: async ({ db }, { role }) => {
    const users = await db
      .query("users")
      .filter((q) =>
        q.and(q.eq(q.field("role"), role), q.eq(q.field("isOnline"), true))
      )
      .collect();

    if (users.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  },
});

// Mutation to send a new message
export const sendMessage = mutation(async ({ db }, { text, userId, randomUser }: { text: string, userId: string, randomUser: string }) => {
  const timestamp = Date.now();
  const newMessage = await db.insert("anonymousChat", {
    text,
    userId,
    randomUser,
    timestamp,
  });
  return newMessage;
});
