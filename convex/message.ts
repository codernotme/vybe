import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Define a mutation to create a new message in a conversation
export const create = mutation({
    // Define the expected arguments for the mutation
    args: {
        conversationId: v.id("conversations"), // The ID of the conversation where the message is sent
        type: v.string(), // The type of message (e.g., text, image, etc.)
        content: v.array(v.string()), // The content of the message, stored as an array of strings
    },
    // Handler function containing the logic for creating a message
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
             .eq("conversationId", args.conversationId) // Match the conversation ID
          )
          .unique();
    
        // If the user is not a member of the conversation, throw an error
        if (!membership) {
          throw new ConvexError("You are not a member of this conversation");
        }

        // Insert the new message into the "messages" collection
        const message = await ctx.db.insert("messages", {
            senderId: currentUser._id, // Set the sender ID to the current user's ID
            ...args, // Spread the rest of the arguments (type and content)
        });

        // Update the conversation with the ID of the last seen message
        await ctx.db.patch(args.conversationId, {
            lastSeenMessageId: message // Update the conversation's last seen message ID
        });

        // Return the newly created message
        return message;
    },  
});
