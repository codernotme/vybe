import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a new newsletter
export const submitNewsletter = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
  },
  handler: async ({ db }, { title, content, authorId }) => {
    const user = await db.get(authorId);
    if (!user) {
      throw new Error("Author not found");
    }

    await db.insert("blog", {
      title,
      content,
      authorId,
      state: "pending", // Default state
      createdAt: Date.now(),
    });
  },
});

// Fetch all blog with a specific state
export const fetchBlogByState = query({
  args: { state: v.string() },
  handler: async ({ db }, { state }) => {
    return await db
      .query("blog")
      .filter(q => q.eq(q.field("state"), state))
      .order("desc")
      .collect();
  },
});

// Update the state of a newsletter
export const updateblogtate = mutation({
  args: {
    newsletterId: v.id("blog"),
    state: v.string(),
  },
  handler: async ({ db }, { newsletterId, state }) => {
    const validStates = ["pending", "approved", "rejected"];
    if (!validStates.includes(state)) {
      throw new Error("Invalid state provided");
    }

    const newsletter = await db.get(newsletterId);
    if (!newsletter) {
      throw new Error("Newsletter not found");
    }

    await db.patch(newsletterId, { state });
  },
});
