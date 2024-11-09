import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Mutation for creating a new friend request
export const create = mutation({
    // Define the arguments expected by this mutation
    args: {
        username: v.string(), // The username of the user to send a friend request to
    },
    // The handler function contains the logic for processing the mutation
    handler: async (ctx, args) => {
        // Retrieve the identity of the currently authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // If the user is not authenticated, throw an error
        if (!identity) {
            throw new ConvexError("Not logged in");
        }

        // Check if the user is trying to send a request to themselves using their username
        if (identity.username === args.username) {
            throw new ConvexError("Cannot send request to yourself");
        }

        // Get the current user's details from the database using their Clerk ID
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        // If the user is not found, throw an error
        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Find the user who is supposed to receive the friend request based on their username
        const receiver = await ctx.db.query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        // If the receiver is not found, throw an error
        if (!receiver) {
            throw new ConvexError("User not found");
        }

        // Additional check to prevent sending a request to themselves based on ID
        if (receiver._id === currentUser._id) {
            throw new ConvexError("Cannot send request to yourself");
        }

        // Check if the current user has already sent a request to this receiver
        const requestAlreadySent = await ctx.db.query("requests")
            .withIndex("by_receiver_sender", (q) => q.eq("receiver", receiver._id).eq("sender", currentUser._id))
            .unique();

        // If a request has already been sent, throw an error
        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        // Check if the receiver has already sent a request to the current user
        const requestAlreadyReceived = await ctx.db.query("requests")
            .withIndex("by_receiver_sender", (q) => q.eq("receiver", currentUser._id).eq("sender", receiver._id))
            .unique();

        // If the receiver has already sent a request, throw an error
        if (requestAlreadyReceived) {
            throw new ConvexError("This user has already sent you a request");
        }

        // Check if the users are already friends
        const friends1 = await ctx.db.query("friends")
            .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
            .collect();

        const friends2 = await ctx.db.query("friends")
            .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
            .collect();

        // If the users are already friends, throw an error
        if (friends1.some((friend) => friend.user2 === receiver._id) ||
            friends2.some((friend) => friend.user1 === receiver._id)) {
            throw new ConvexError("Friend already exists");
        }

        // Insert the friend request into the database
        const request = await ctx.db.insert("requests", {
            sender: currentUser._id,
            receiver: receiver._id,
        });

        // Return the created request
        return request;
    },
});

// Mutation for denying a friend request
export const deny = mutation({
    // Define the arguments expected by this mutation
    args: {
        id: v.id("requests"), // The ID of the request to deny
    },
    // The handler function contains the logic for processing the mutation
    handler: async (ctx, args) => {
        // Retrieve the identity of the currently authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // If the user is not authenticated, throw an error
        if (!identity) {
            throw new ConvexError("Not logged in");
        }

        // Get the current user's details from the database using their Clerk ID
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        // If the user is not found, throw an error
        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Get the request from the database using the provided ID
        const request = await ctx.db.get(args.id);

        // If the request is not found or the current user is not the receiver, throw an error
        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError("Error denying this request");
        }

        // Delete the request from the database
        await ctx.db.delete(request._id);
    },
});

// Mutation for accepting a friend request
export const accept = mutation({
    // Define the arguments expected by this mutation
    args: {
        id: v.id("requests"), // The ID of the request to accept
    },
    // The handler function contains the logic for processing the mutation
    handler: async (ctx, args) => {
        // Retrieve the identity of the currently authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // If the user is not authenticated, throw an error
        if (!identity) {
            throw new ConvexError("Not logged in");
        }

        // Get the current user's details from the database using their Clerk ID
        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        // If the user is not found, throw an error
        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Get the request from the database using the provided ID
        const request = await ctx.db.get(args.id);

        // If the request is not found or the current user is not the receiver, throw an error
        if (!request || request.receiver !== currentUser._id) {
            throw new ConvexError("Error accepting this request");
        }

        // Create a new conversation for the two friends
        const conversationId = await ctx.db.insert("conversations", {
            isGroup: false, // This is a one-on-one conversation
        });

        // Insert the new friendship into the database
        await ctx.db.insert("friends", {
            user1: currentUser._id, // The current user
            user2: request.sender,  // The sender of the request
            conversationId,         // The ID of the conversation created for them
        });

        // Add both users to the conversation as members
        await ctx.db.insert("conversationMembers", {
            memberId: currentUser._id,
            conversationId
        });
        await ctx.db.insert("conversationMembers", {
            memberId: request.sender,
            conversationId
        });

        // Delete the friend request from the database
        await ctx.db.delete(request._id);
    },
});
