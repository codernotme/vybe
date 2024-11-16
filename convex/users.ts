import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Mutation to update user data by Clerk ID
export const update = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    password: v.string(),
    name: v.string(),
    githubUsername: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found in the database");
    }

    const updatedFields = Object.fromEntries(
      Object.entries(args).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(user._id, updatedFields);

    return { ...user, ...updatedFields };
  },
});

// Query to get user data by Clerk ID
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const user = await ctx.db.get(currentUser._id);

    if (!user) {
      throw new ConvexError("User not found in the database");
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      githubUsername: user.githubUsername,
      clerkId: user.clerkId,
    };
  },
});
