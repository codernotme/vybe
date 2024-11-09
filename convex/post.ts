import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Mutation to create a new post
export const create = mutation({
  // Expected arguments for creating a post
  args: {
    type: v.string(),                // Required: Type of the post (e.g., text, image, video)
    content: v.optional(v.string()), // Optional: Text content
    imageUrl: v.optional(v.string()),// Optional: Image URL
    videoUrl: v.optional(v.string()),// Optional: Video URL
    gifUrl: v.optional(v.string())
  },
  handler: async (ctx, { type, content, imageUrl, videoUrl, gifUrl }) => {
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
      likesCount: 0,             // Initial likes count
      type,                      // Post type (required)
      content: content || "",    // Optional content (empty string if undefined)
      imageUrl: imageUrl || undefined, // Optional image URL (undefined if not provided)
      videoUrl: videoUrl || undefined,  // Optional video URL (undefined if not provided)
      gifUrl: gifUrl || undefined,
    };

    // Insert the new post into the "posts" collection
    const newPost = await ctx.db.insert("posts", postData);

    return newPost;  // Return the newly created post
  },
});


export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    await ctx.db.delete(postId);
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),        // Required: Post ID the comment belongs to
    content: v.string(),          // Required: Content of the comment
  },
  handler: async (ctx, { postId, content }) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve user details using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Construct the new comment data
    const commentData = {
      postId,            // Post ID
      userId: currentUser._id,   // Current user ID
      content,            // Comment content
    };

    // Insert the new comment into the "comments" collection
    const newComment = await ctx.db.insert("comments", commentData);

    return newComment;
  },
});

// Mutation to delete a comment with post ownership and self-comment checks
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"), // ID of the comment to delete
  },
  handler: async (ctx, { commentId }) => {
    // Get the current user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Retrieve the current user's details using Clerk ID
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Find the comment in the database
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new ConvexError("Comment not found.");
    }

    // Find the post the comment belongs to
    const post = await ctx.db.get(comment.postId);
    if (!post) {
      throw new ConvexError("Post not found.");
    }

    // Check if the current user is the owner of the post or the comment
    const isPostOwner = post.userId === currentUser._id; // Post owner
    const isCommentOwner = comment.userId === currentUser._id; // Comment owner

    if (isPostOwner || isCommentOwner) {
      // If the user is either the post owner or the comment owner, allow deletion
      await ctx.db.delete(commentId);
    } else {
      // Otherwise, throw an error
      throw new ConvexError("You are not authorized to delete this comment.");
    }
  },
});

export const like = mutation({
  args: {
    postId: v.id("posts"), // Validates postId
  },
  handler: async (ctx, args) => {
    // Get the current user's identity from the authentication context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized access. Please log in.");
    }

    // Fetch the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new ConvexError("Post not found.");
    }

    // Fetch the current user
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new ConvexError("User not found. Please check your account.");
    }

    // Check if the user has already liked the post
    const likeRecord = await ctx.db.query("likes")
      .filter(q => q.eq(q.field("postId"), args.postId) && q.eq(q.field("userId"), currentUser._id))
      .first();

    if (likeRecord) {
      // If the user has already liked the post, unlike it
      await ctx.db.delete(likeRecord._id);

      // Decrease the likes count on the post, but ensure it doesn't go below 0
      const newLikesCount = post.likesCount > 0 ? post.likesCount - 1 : 0;
      await ctx.db.patch(args.postId, {
        likesCount: newLikesCount,
      });
    } else {
      // Otherwise, like the post
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });

      // Increase the likes count on the post
      await ctx.db.patch(args.postId, {
        likesCount: post.likesCount + 1,
      });
    }

    return { success: true };
  },
});