import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Define a query to get both the current user's and their friends' posts
export const get = query({
  args: {},
  handler: async (ctx, args) => {
    try {
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

      // Fetch posts from the current user
      const userPosts = await ctx.db
        .query("posts")
        .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
        .collect();

      // Fetch the friendships where the current user is either user1 or user2
      const friendships = await ctx.db
        .query("friends")
        .filter((q) =>
          q.or(
            q.eq("user1", currentUser._id.toString()),
            q.eq("user2", currentUser._id.toString())
          )
        )
        .collect();

      // Fetch posts for each friend
      const friendsPostsPromises = friendships.map(async (friendship) => {
        const friendId =
          friendship.user1.toString() === currentUser._id.toString()
            ? friendship.user2
            : friendship.user1;

        // Fetch all posts from the friend
        return ctx.db
          .query("posts")
          .withIndex("by_userId", (q) => q.eq("userId", friendId))
          .collect();
      });

      // Wait for all friend's posts to be fetched
      const friendsPostsArrays = await Promise.all(friendsPostsPromises);
      const friendsPosts = friendsPostsArrays.flat();

      // Fetch posts from users with the role "community"
      const communityPosts = await ctx.db
        .query("posts")
        .filter((q) => q.eq(q.field("userRole"), "community"))
        .collect();

      // Combine user's, friends', and community posts
      const allPosts = [...userPosts, ...friendsPosts, ...communityPosts];

      // Remove duplicate posts
      const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
        .map(id => allPosts.find(post => post._id === id));

      // Sort all posts by creation time (newest first)
      uniquePosts.sort(
        (a, b) =>
          new Date(b?._creationTime ?? 0).getTime() -
          new Date(a?._creationTime ?? 0).getTime()
      );

      // Fetch author details for each post
      const postsWithAuthors = await Promise.all(
        uniquePosts.map(async (post) => {
          if (!post) {
            throw new ConvexError("Post not found");
          }
          const author = await ctx.db.get(post.userId);

          if (!author) {
            throw new ConvexError("Post author not found");
          }

          return {
            post,
            authorImage: author.imageUrl,
            authorName: author.username,
            isCurrentUser:
              post.userId.toString() === currentUser._id.toString(), // Check if the current user is the author
          };
        })
      );

      return postsWithAuthors;
    } catch (error) {
      // Handle and log errors for better debugging
      console.error("Error fetching posts:", error);
      throw new ConvexError("Failed to fetch posts");
    }
  },
});

export const getComments = query({
  args: { postId: v.id("posts") }, // Accept postId as an argument
  handler: async (ctx, { postId }) => {
    try {
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

      // Fetch comments for the specific post
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect();

      // Check if any comments were found
      if (!comments.length) {
        return []; // Return an empty array if no comments found
      }

      // Sort comments by creation time (newest first)
      comments.sort(
        (a, b) =>
          new Date(b?._creationTime ?? 0).getTime() -
          new Date(a?._creationTime ?? 0).getTime()
      );

      // Fetch author details for each comment
      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          const author = await ctx.db.get(comment.userId);

          if (!author) {
            throw new ConvexError("Comment author not found");
          }

          return {
            comment,
            authorImage: author.imageUrl,
            authorName: author.username,
          };
        })
      );

      return commentsWithAuthors;
    } catch (error) {
      // Handle and log errors for better debugging
      console.error("Error fetching comments:", error);
      throw new ConvexError("Failed to fetch comments");
    }
  },
});

export const getLike = query({
  args: {
    postId: v.id("posts"), // Accept the post ID
  },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    return post.likesCount || 0;
  },
});

export const create = mutation({
  // Expected arguments for creating a post
  args: {
    type: v.string(),                // Required: Type of the post (e.g., text, image, video)
    content: v.optional(v.string()), // Optional: Text content
    imageUrl: v.optional(v.string()),// Optional: Image URL
    gifUrl: v.optional(v.string()),  // Optional: GIF URL
    pdfUrl: v.optional(v.string()),  // Optional: PDF URL
  },
  handler: async (ctx, { type, content, imageUrl, gifUrl, pdfUrl }) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve user details from the database using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Construct the new post data
    const postData = {
      userId: currentUser._id,   // Current user ID
      userRole: currentUser.role, // Add user role
      likesCount: 0,             // Initial likes count
      type,                      // Post type (required)
      content: content || "",    // Optional content (empty string if undefined)
      imageUrl: imageUrl || undefined, // Optional image URL (undefined if not provided)
      gifUrl: gifUrl || undefined,     // Optional GIF URL (undefined if not provided)
      pdfUrl: pdfUrl || undefined,     // Optional PDF URL (undefined if not provided)
      _creationTime: Date.now(), // Add creation time
    };

    // Insert the new post into the "posts" collection
    const newPost = await ctx.db.insert("posts", postData);

    return newPost;  // Return the newly created post
  },
});