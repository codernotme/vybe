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
const generateAnonymousUsername = (userId: string) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const seed = `${userId}-${day}-${month}-${year}`;
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `anonymous user ${hash % 1000}`;
};

export const sendMessage = mutation(async ({ db }, { text, userId, randomUser }: { text: string, userId: string, randomUser: string }) => {
  const timestamp = Date.now();
  const anonymousUsername = generateAnonymousUsername(userId);
  const newMessage = await db.insert("anonymousChat", {
      text,
      userId,
      randomUser,
      timestamp,
      anonymousUsername // Store anonymous username
    });
  return newMessage;
});
