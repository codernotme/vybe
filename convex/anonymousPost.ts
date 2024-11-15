// convex/anonymousPost.ts
import { mutation, query } from "./_generated/server";

const DAILY_POST_LIMIT = 5;

export const addPost = mutation(async ({ db }, { text, userId }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  // Count today's posts by this user
  const postCount = await db
    .query("anonymousPost")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .filter((q) => q.gt("timestamp", today.getTime()))
    .count();

  if (postCount >= DAILY_POST_LIMIT) {
    return { error: "You have reached the daily post limit of 5." };
  }

  // Add the post if within the limit
  const post = {
    text,
    userId,
    timestamp: Date.now(),
  };
  await db.insert("anonymousPost", post);
  return { success: true };
});

export const getPosts = query(async ({ db }) => {
  // Retrieve posts, ordered by timestamp in descending order
  return await db.query("anonymousPost").withIndex("by_timestamp").order("timestamp", "desc").collect();
});
