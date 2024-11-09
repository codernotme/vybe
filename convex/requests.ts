import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    // Get the authenticated user's identity from the context
    const identity = await ctx.auth.getUserIdentity();

    // If there is no authenticated user, throw an error
    if (!identity) {
      // Specific error message indicating that the user is unauthorized
      throw new ConvexError("Unauthorized - User has logged out");
    }

    // Retrieve the current user from the database using their Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject
    });

    // If the user is not found in the database, throw an error
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Query the "requests" table to find all friend requests sent to the current user
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    // For each request, retrieve the sender's details and combine them with the request data
    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        // Retrieve the sender's details using their ID
        const sender = await ctx.db.get(request.sender);

        // If the sender is not found, throw an error
        if (!sender) {
          throw new ConvexError("Sender not found");
        }

        // Return an object containing the sender's details and the request data
        return { sender, request };
      })
    );

    // Return the list of requests along with the corresponding sender's details
    return requestsWithSender;
  }
});

export const count = query({
  args: {},
  handler: async (ctx, args) => {
    // Get the authenticated user's identity from the context
    const identity = await ctx.auth.getUserIdentity();

    // If there is no authenticated user, throw an error
    if (!identity) {
      // Specific error message indicating that the user is unauthorized
      throw new ConvexError("Unauthorized - User has logged out");
    }

    // Retrieve the current user from the database using their Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject
    });

    // If the user is not found in the database, throw an error
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Query the "requests" table to count the number of friend requests sent to the current user
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    // Return the count of friend requests
    return requests.length;
  }
});
