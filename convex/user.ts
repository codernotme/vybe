import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

// Mutation to create a new user in the database
export const create = internalMutation({
    args: {
        username: v.string(),   // Username of the new user
        password: v.string(),   // Password for the new user (should be hashed before storing)
        email: v.string(),      // Email address of the new user
        name: v.string(),       // Full name of the new user
        imageUrl: v.string(),   // URL of the user's profile image
        clerkId: v.string()     // Unique identifier from Clerk authentication
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
