import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

const generateAnonymousUsername = (userId: string) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const seed = `${userId}-${day}-${month}-${year}`;
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `anonymous user ${hash % 1000}`;
};

// Mutation to update user data by Clerk ID
export const update = mutation({
  args: v.object({
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    password: v.string(),
    name: v.string(),
    githubUsername: v.optional(v.string()),
    role: v.string(),
    isOnline: v.optional(v.boolean()),
    description: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
  }),
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

    const updatedFields = {
      ...args,
      anonymousUsername: generateAnonymousUsername(args.clerkId)
    };

    await ctx.db.patch(user._id, updatedFields);

    return { ...user, ...updatedFields };
  },
});

// Query to get user data by Clerk ID
export const get = query({
  args: v.object({}),
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
      isOnline: user.isOnline,
      description: user.description,
      interests: user.interests,
    };
  },
});

export const search = query({
  args: v.object({ username: v.string() }),
  handler: async (ctx, { username }) => {
    try {
      const users = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .collect();
      return users.map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
        githubUsername: user.githubUsername,
        clerkId: user.clerkId,
        isOnline: user.isOnline,
        description: user.description,
        interests: user.interests,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users.");
    }
  },
});
