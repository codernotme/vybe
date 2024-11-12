import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

// Mutation to create a new user in the database
export const create = internalMutation({
    args: {
        username: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        password: v.string(),
        name: v.string(),
        githubUsername: v.optional(v.string()),
        role: v.string()
    },
    handler: async (ctx, args) => {
        // Insert the new user record into the "users" table
        await ctx.db.insert("users", args);
    },
});

// Query to retrieve a user by their Clerk ID
export const get = internalQuery({
    args: {
        clerkId: v.string() // The Clerk ID of the user to be retrieved
    },
    handler: async (ctx, args) => {
        // Query the "users" table using the "by_clerkId" index to find the user with the specified Clerk ID
        return ctx.db.query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique(); // Expect a unique result since Clerk IDs are unique
    },
});
