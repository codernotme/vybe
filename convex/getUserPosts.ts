import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";
import { query } from "./_generated/server";

// Fetch posts for a specific user
export const getUserPosts = query({
  args: {},
  handler: async (ctx, args) => {
    // Retrieve the authenticated user's identity
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Fetch the current user details using their Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    try {
      // Fetch posts from the current user only
      const userPosts = await ctx.db
        .query("posts")
        .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
        .collect();

      // Sort posts by creation time
      userPosts.sort((a, b) => new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime());

      // Fetch author details for each post
      const postsWithAuthors = await Promise.all(
        userPosts.map(async (post) => {
          const author = await ctx.db.get(post.userId);

          if (!author) {
            throw new ConvexError("Post author not found");
          }

          return {
            post,
            authorImage: author.imageUrl,
            authorName: author.username,
            isCurrentUser: true, // Since we are only showing the current user's posts
          };
        })
      );

      return postsWithAuthors;
    } catch (error) {
      throw new ConvexError("Failed to fetch posts");
    }
  },
});
