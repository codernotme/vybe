import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to generate anonymous username
const generateAnonymousUsername = (userId: string) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const seed = `${userId}-${day}-${month}-${year}`;
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `anonymous user ${hash % 1000}`;
};

// Mutation to add an anonymous post
export const addPost = mutation({
  args: {
    text: v.string(),
    userId: v.optional(v.string()),
    isAnonymous: v.boolean(),
    duration: v.number(),
    imageUrl: v.optional(v.string()),
    gifUrl: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
  },
  handler: async ({ db }, { text, userId, isAnonymous, duration, imageUrl, gifUrl, pdfUrl }) => {
    const timestamp = Date.now();
    const anonymousUsername = generateAnonymousUsername(userId || "defaultUserId");
    await db.insert("anonymousPost", { text, userId, timestamp, isAnonymous, duration, imageUrl, gifUrl, pdfUrl, anonymousUsername });
  },
});

// Query to fetch posts that are not older than 24 hours
export const getPosts = query({
  handler: async ({ db }) => {
    const now = Date.now();
    return await db
      .query("anonymousPost")
      .filter(q => q.gte(q.field("timestamp"), now - 24 * 60 * 60 * 1000))
      .order("desc")
      .collect();
  },
});

// Mutation to delete a post
export const deletePost = mutation({
  args: { postId: v.id("anonymousPost"), userId: v.string() },
  handler: async ({ db }, { postId, userId }) => {
    const post = await db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }
    if (post.userId !== userId) {
      throw new ConvexError("Permission denied");
    }
    await db.delete(postId);
  },
});

// Query to fetch comments for an anonymous post
export const getComments = query({
  args: { postId: v.id("anonymousPost") },
  handler: async ({ db }, { postId }) => {
    return await db.query("anonymousComments").filter(q => q.eq(q.field("postId"), postId)).collect();
  },
});

// Mutation to add a comment to an anonymous post
export const addComment = mutation({
  args: {
    postId: v.id("anonymousPost"),
    content: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async ({ db }, { postId, content, userId }) => {
    const timestamp = Date.now();
    const username = generateAnonymousUsername(userId || "defaultUserId");
    await db.insert("anonymousComments", { postId, content, timestamp, username, userId} as any);
  },
});

// Mutation to delete a comment from an anonymous post
export const deleteComment = mutation({
  args: { commentId: v.id("anonymousComments") },
  handler: async ({ db }, { commentId }) => {
    await db.delete(commentId);
  },
});

// Mutation to like an anonymous post
export const like = mutation({
  args: { postId: v.id("anonymousPost"), userId: v.optional(v.string()) },
  handler: async ({ db }, { postId, userId }) => {
    const existingLike = await db
      .query("anonymousLikes")
      .filter(q => q.eq(q.field("postId"), postId))
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    if (!existingLike) {
      await db.insert("anonymousLikes", { postId, userId });
    }
  },
});
