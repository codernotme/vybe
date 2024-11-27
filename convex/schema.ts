import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { user } from "@nextui-org/react";

export default defineSchema({
  // Define the "users" table to store user information
  users: defineTable({
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    password: v.string(),
    name: v.string(),
    githubUsername: v.optional(v.string()), // GitHub username
    role: v.string(), // 'admin', 'mentor', 'member', 'tech', 'community'
    isOnline: v.optional(v.boolean()),
    description: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    anonymousUsername: v.optional(v.string()), // Add anonymousUsername field
  })
    .index("by_username", ["username"])
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // Define the "requests" table to manage friend requests between users
  requests: defineTable({
    sender: v.id("users"), // The ID of the user sending the request
    receiver: v.id("users"), // The ID of the user receiving the request
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),

  // Define the "friends" table to manage friendships between users
  friends: defineTable({
    user1: v.id("users"), // The ID of the first user in the friendship
    user2: v.id("users"), // The ID of the second user in the friendship
    conversationId: v.id("conversations"), // ID of the conversation between the two friends
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),

  // Define the "conversations" table to store conversation details
  conversations: defineTable({
    name: v.optional(v.string()), // Optional name of the conversation (e.g., group name)
    isGroup: v.boolean(), // Boolean to indicate if it's a group conversation
    lastSeenMessageId: v.optional(v.id("messages")), // ID of the last seen message in the conversation
  }),

  // Define the "conversationMembers" table to manage members of conversations
  conversationMembers: defineTable({
    memberId: v.id("users"), // The ID of the user who is a member of the conversation
    conversationId: v.id("conversations"), // The ID of the conversation
    lastSeenMessage: v.optional(v.id("messages")), // ID of the last message seen by the user in the conversation
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_memberId_conversationId", ["memberId", "conversationId"]),

  // Define the "messages" table to store messages within conversations
  messages: defineTable({
    conversationId: v.id("conversations"), // ID of the conversation the message belongs to
    senderId: v.id("users"), // ID of the user who sent the message
    content: v.array(v.string()), // Array of strings representing the content of the message (e.g., text, links)
    type: v.string(), // Type of the message (e.g., text, image, etc.)
  }).index("by_conversationId", ["conversationId"]),

  // Define the "posts" table to store post information
  posts: defineTable({
    userId: v.id("users"), // The ID of the user who created the post
    content: v.optional(v.string()), // Content of the post (text)
    imageUrl: v.optional(v.string()), // URL of the image associated with the post
    videoUrl: v.optional(v.string()), // URL of the video associated with the post
    gifUrl: v.optional(v.string()), // URL of the GIF associated with the post
    type: v.string(), // Type of the post (text, image, video, audio)
    userRole: v.string(), // Role of the user who created the post
    likesCount: v.number(), // Number of likes on the post
  }).index("by_userId", ["userId"]),

  likes: defineTable({
    postId: v.id("posts"), // The ID of the liked post
    userId: v.id("users"), // The ID of the user who liked the post
  }).index("by_post_and_user", ["postId", "userId"]),

  // Define the "comments" table to store comments on posts
  comments: defineTable({
    postId: v.id("posts"), // ID of the post the comment belongs to
    userId: v.id("users"), // ID of the user who made the comment
    content: v.string(), // Content of the comment
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"]),

  // Define the "projectWorkspaces" table to store project workspace information
  projectWorkspaces: defineTable({
    ownerId: v.id("users"), // The ID of the project owner
    repoName: v.string(), // The name of the linked GitHub repo
    repoUrl: v.string(), // GitHub repository URL
    techStack: v.array(v.string()), // Array of strings representing the tech stack used
    status: v.string(), // Status of the project (e.g., active, completed)
  }).index("by_owner", ["ownerId"]),

  // Define the "projectMembers" table to manage members of project workspaces
  projectMembers: defineTable({
    projectId: v.id("projectWorkspaces"), // The project workspace ID
    memberId: v.id("users"), // User ID of the member
    role: v.string(), // Role (member, moderator, staff)
  })
    .index("by_projectId", ["projectId"])
    .index("by_memberId", ["memberId"]),

  // Define the "projectTodos" table to store todos within project workspaces
  projectTodos: defineTable({
    projectId: v.id("projectWorkspaces"), // The associated project ID
    creatorId: v.id("users"), // The ID of the user who created the todo
    content: v.string(), // Todo content
    completed: v.boolean(), // Status of the todo
  }).index("by_projectId", ["projectId"]),

  // Define the "projectChats" table to store chat messages within project workspaces
  projectChats: defineTable({
    projectId: v.id("projectWorkspaces"), // The associated project ID
    senderId: v.id("users"), // The ID of the user who sent the message
    content: v.string(), // Chat message content
  }).index("by_projectId", ["projectId"]),
  // Define the "blog" table for blog submissions
  // Define the "blog" table for blog submissions
  blog: defineTable({
    title: v.string(), // Title of the blog post
    content: v.string(), // Content of the blog post
    authorId: v.id("users"), // ID of the user (mentor or community member) who wrote the blog
    createdAt: v.number(), // Timestamp for when the blog was created
    state: v.string(), // State of the blog post (e.g., "pending", "approved", "rejected")
  })
    .index("by_authorId", ["authorId"]) // Index for fetching all posts by a specific author
    .index("by_state", ["state"]) // Index for fetching posts based on state
    .index("by_createdAt", ["createdAt"]), // Index for fetching posts in chronological order

  //Anonymous chats
  anonymousChat: defineTable({
    text: v.string(),
    userId: v.optional(v.string()), // Make userId optional
    randomUser: v.optional(v.string()), // Add randomUser field
    timestamp: v.number(),
    anonymousUsername: v.string(), // Add anonymousUsername field
  }).index("by_userId", ["userId"]),

  //Anonymous Post
  anonymousPost: defineTable({
    text: v.string(),
    userId: v.optional(v.string()), // Make userId optional
    timestamp: v.number(),
    isAnonymous: v.boolean(), // Add isAnonymous field
    duration: v.number(), // Add duration field
    imageUrl: v.optional(v.string()), // Add imageUrl field
    gifUrl: v.optional(v.string()), // Add gifUrl field
    pdfUrl: v.optional(v.string()), // Add pdfUrl field
    anonymousUsername: v.string(), // Add anonymousUsername field
    _creationTime: v.number(), // Change _creationTime field to number
  }).index("by_userId", ["userId"]),

  // Define the "anonymousComments" table to store comments on anonymous posts
  anonymousComments: defineTable({
    postId: v.id("anonymousPost"), // ID of the anonymous post the comment belongs to
    userId: v.optional(v.string()), // ID of the user who made the comment (optional)
    content: v.string(), // Content of the comment
    timestamp: v.number(), // Timestamp of the comment
    username: v.optional(v.string()), // Username of the user who made the comment (optional)
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"]),

  // Define the "anonymousLikes" table to store likes on anonymous posts
  anonymousLikes: defineTable({
    postId: v.id("anonymousPost"), // The ID of the liked post
    userId: v.optional(v.string()), // The ID of the user who liked the post (optional)
  }).index("by_post_and_user", ["postId", "userId"]),

  // Define the "events" table to store event information
  events: defineTable({
    id: v.optional(v.id("events")), // ID of the event
    title: v.string(), // Title of the event
    description: v.string(), // Description of the event
    date: v.number(), // Date of the event
    location: v.string(), // Location of the event
    createdBy: v.optional(v.id("users")), // ID of the user who created the event
    attendees: v.optional(v.array(v.id("users"))), // Optional array of user IDs who are attending the event
  }).index("by_createdBy", ["createdBy"]),

  // Define the "communityChatGroups" table to store community chat group information
  communityChatGroups: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    members: v.array(v.id("users")),
    conversationId: v.id("conversations"),
  }).index("by_ownerId", ["ownerId"]),
});
