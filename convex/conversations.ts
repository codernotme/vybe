import { ConvexError } from "convex/values";
import { query, QueryCtx, MutationCtx } from './_generated/server';
import { getUserByClerkId } from "./_utils";
import { Id } from './_generated/dataModel';

// Define the query to fetch conversations for the current user
export const get = query({
  args: {},
  handler: async (ctx, args) => {
    // Retrieve the identity of the currently authenticated user
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

    // Fetch the memberships of conversations the user is a part of
    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    // Retrieve the actual conversation objects from the database
    const conversations = await Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }

        return conversation;
      })
    );

    // Fetch details for each conversation, including last message and members
    const conversationWithDetails = await Promise.all(
      conversations.map(async (conversation, index) => {
        // Fetch all members of the current conversation
        const allConversationMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id)
          )
          .collect();

        // Fetch the last message details of the conversation
        const lastMessage = await getLastMessageDetails({ctx, id: conversation.lastSeenMessageId});

        // If the conversation is a group, return conversation and last message
        if (conversation.isGroup) {
          return { conversation, lastMessage };
        } else {
          // If it's not a group, find the other member in the conversation
          const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
          )[0];

          // Fetch the details of the other member
          const otherMember = await ctx.db.get(otherMembership.memberId);

          // Return conversation, other member details, and last message
          return { conversation, otherMember, lastMessage };
        }
      })
    );

    // Return the conversation details along with additional information
    return conversationWithDetails;
  }
});

// Helper function to fetch details of the last message in a conversation
const getLastMessageDetails = async({
  ctx, id
}: {
  ctx: QueryCtx | MutationCtx, id: Id<"messages"> | undefined;
}) => {
  
  // If there is no last message ID, return null
  if(!id){
    return null;
  }

  // Fetch the last message from the database
  const message = await ctx.db.get(id);
  if(!message){
    return null;
  }

  // Fetch the sender's details of the message
  const sender = await ctx.db.get(message.senderId);
  if(!sender){
    return null;
  }

  // Get the content of the message based on its type
  const content = getMessageContent(
    message.type, message.content as unknown as string
  );

  // Return the message content and sender's username
  return {
    content,
    sender: sender.username
  }
}

// Helper function to get the content of a message based on its type
const getMessageContent = (type: string, content: string) => {
  switch(type){
    case "text":
      return content;  // Return text content as is
    case "image":
      return content;  // Return image content (could be a URL or encoded image data)
    // Future cases for video, file, etc., can be added here
    default:
      return "[Non-text]";  // Return a placeholder for non-text content
  }
}
