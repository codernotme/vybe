import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Define a query to fetch the list of friends for the current user
export const get = query({
    args: {},
    handler: async (ctx, args) => {
        // Retrieve the identity of the currently authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // If no identity is found, throw an unauthorized error
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        // Fetch the current user's details from the database using their Clerk ID
        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject
        });

        // If the user is not found, throw a user not found error
        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Fetch friendships where the current user is user1
        const friendships1 = await ctx.db
            .query("friends")
            .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
            .collect();

        // Fetch friendships where the current user is user2
        const friendships2 = await ctx.db
            .query("friends")
            .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
            .collect();

        // Combine both sets of friendships into a single array
        const friendships = [...friendships1, ...friendships2];

        // Fetch the details of each friend based on the friendship data
        const friends = await Promise.all(
            friendships.map(async (friendship) => {
                // Determine which user in the friendship is the friend and fetch their details
                const friend = await ctx.db.get(friendship.user1 === currentUser._id ? friendship.user2 : friendship.user1);

                // If the friend's details cannot be found, throw an error
                if (!friend) {
                    throw new ConvexError("Friend not found");
                }

                // Return the friend's details
                return friend;
            })
        );

        // Return the list of friends for the current user
        return friends;
    }
});
