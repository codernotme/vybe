import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Define a query to get messages from a conversation
export const get = query({
    // Define the expected arguments for the query
    args: {
        id: v.id("conversations"), // The ID of the conversation to retrieve messages from
    },
    // Handler function containing the logic to retrieve conversation messages
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

        // Check if the user is a member of the specified conversation
        const membership = await ctx.db
          .query("conversationMembers")
          .withIndex("by_memberId_conversationId", (q) => 
            q.eq("memberId", currentUser._id) // Match the user ID
             .eq("conversationId", args.id) // Match the conversation ID
          )
          .unique();

        // If the user is not a member of the conversation, throw an error
        if (!membership) {
          throw new ConvexError("You are not a member of this conversation");
        }

        // Retrieve messages from the specified conversation, ordered by most recent
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
          .order("desc") // Order messages in descending order (latest first)
          .collect();

        // Fetch additional details about each message, including the sender's info
        const messagesWithUsers = await Promise.all(
          messages.map(async (message) => {
            // Get the sender's details from the database
            const messageSender = await ctx.db.get(message.senderId);

            // If the sender is not found, throw an error
            if (!messageSender) {
              throw new ConvexError("Message sender not found");
            }

            // Return an object containing the message and sender details
            return {
                message, // The message itself
                senderImage: messageSender.imageUrl, // Sender's profile image
                senderName: messageSender.username, // Sender's username
                isCurrentUser: messageSender._id === currentUser._id, // Flag to indicate if the current user is the sender
            };
        }));

        // Return the array of messages with sender details
        return messagesWithUsers;
    },
});

