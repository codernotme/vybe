import { mutation } from './_generated/server';
import { v, ConvexError } from 'convex/values';
import { getUserByClerkId } from "./_utils";

// Mutation to update a user's role by their username
export const updateUserRole = mutation({
  args: { username: v.string(), newRole: v.string() },
  handler: async (ctx, { username, newRole }) => {
    const { db, auth } = ctx;

    // Get the current user identity
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve current user details from the database using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("Current user not found.");
    }

    // Prevent users from updating their own role
    if (currentUser.username === username) {
      throw new ConvexError("You cannot update your own role.");
    }

    // Find the user by their username
    const user = await db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();

    if (!user) {
      throw new ConvexError("Target user not found.");
    }

    // Update the user's role
    await db.patch(user._id, { role: newRole });

    return { success: true, message: "Role updated successfully" };
  },
});
