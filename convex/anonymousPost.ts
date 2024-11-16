import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addPost = mutation({
  args: {
    text: v.string(),
    userId: v.optional(v.string()),
    isAnonymous: v.boolean(),
    duration: v.number(),
  },
  handler: async ({ db }, { text, userId, isAnonymous, duration }) => {
    const timestamp = Date.now();
    await db.insert("anonymousPost", { text, userId, timestamp, isAnonymous, duration });
  },
});

export const getPosts = query({
  handler: async ({ db }) => {
    const now = Date.now();
    return await db.query("anonymousPost")
      .filter(q => q.gte(q.field("timestamp"), now - 24 * 60 * 60 * 1000))
      .order("desc")
      .collect();
  },
});
