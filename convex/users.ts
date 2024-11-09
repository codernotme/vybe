import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Mutation to update user data by Clerk ID
export const update = mutation({
  args: {
    clerkId: v.string(), // The Clerk ID of the user to be updated
    username: v.optional(v.string()), // Optional new username
    email: v.optional(v.string()), // Optional new email
    name: v.optional(v.string()), // Optional new name
    imageUrl: v.optional(v.string()) // Optional new image URL
  },
  handler: async (ctx, args) => {
    // Get the user identity from the auth context
    const identity = await ctx.auth.getUserIdentity();

    // If no identity is found, throw an unauthorized error
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Query the "users" table using the "by_clerkId" index to find the user
    const user = await ctx.db.query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    // Check if the user is null
    if (!user) {
      throw new ConvexError("User not found in the database");
    }

    // Filter out undefined fields from the update arguments
    const updatedFields = Object.fromEntries(
      Object.entries(args).filter(([_, value]) => value !== undefined)
    );

    // Use the `patch` method to update the user record
    await ctx.db.patch(user._id, updatedFields);

    // Return the updated user data
    return { ...user, ...updatedFields };
  }
});

// Query to get user data by Clerk ID
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // If no identity is found, throw an unauthorized error
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
  
    // Fetch the user details from the database using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject
    });
  
    // If the user is not found, throw a user not found error
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const user = await ctx.db.get(currentUser._id);

    if (!user) {
      throw new ConvexError("User not found in the database");
    }

    // Return only the fields you want
    return {
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl
    };
  }
});
