import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Define a mutation to remove a conversation and its associated data
export const remove = mutation({
    // Specify the arguments the mutation expects
    args: {
        conversationId: v.id("conversations"), // The ID of the conversation to remove
    },
    // Handler function that contains the logic for removing the conversation
    handler: async (ctx, args) => {
        // Get the identity of the currently authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // If no identity is found, throw an unauthorized error
        if (!identity) {
          throw new ConvexError("Unauthorized");
        }

        // Retrieve the current user from the database using Clerk ID
        const currentUser = await getUserByClerkId({
          ctx,
          clerkId: identity.subject
        });

        // If the user is not found, throw a user not found error
        if (!currentUser) {
          throw new ConvexError("User not found");
        }

        // Fetch the conversation to be removed from the database
        const conversation = await ctx.db.get(args.conversationId);
        // If the conversation is not found, throw a conversation not found error
        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }

        // Retrieve all memberships associated with the conversation
        const memberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
          .collect();

        // If there are no memberships or if the conversation doesn't have exactly 2 members, throw an error
        if (!memberships || memberships.length !== 2) {
          throw new ConvexError("Conversation not found");
        }

        // Retrieve the friendship associated with the conversation
        const friendship = await ctx.db.query("friends").withIndex("by_conversationId", (q) => {
            return q.eq("conversationId", args.conversationId);
        }).unique();

        // If no friendship is found, throw a friendship does not exist error
        if (!friendship) {
          throw new ConvexError("Friendship does not exist");
        }

        // Retrieve all messages associated with the conversation
        const messages = await ctx.db.query("messages").withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId)).collect();
        
        // Delete the conversation from the database
        await ctx.db.delete(args.conversationId);

        // Delete the associated friendship from the database
        await ctx.db.delete(friendship._id);

        // Delete all memberships associated with the conversation
        await Promise.all(memberships.map(async (membership) => {
            await ctx.db.delete(membership._id);
        }));

        // Delete all messages associated with the conversation
        await Promise.all(messages.map(async (message) => {
            await ctx.db.delete(message._id);
        }));
    },
});
