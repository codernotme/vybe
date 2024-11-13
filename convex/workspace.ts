import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Fetch all project workspaces for the current user
export const getProjectWorkspaces = query({
  args: {},
  handler: async ({ db }) => {
    try {
      return await db.query("projectWorkspaces").collect();
    } catch (error) {
      console.error("Error fetching project workspaces:", error);
      throw new Error("Failed to fetch project workspaces");
    }
  },
});

// Fetch a single project workspace by projectId
export const getProjectWorkspace = query({
  args: {
    projectId: v.id("projectWorkspaces"),
  },
  handler: async ({ db }, { projectId }) => {
    try {
      return await db.get(projectId);
    } catch (error) {
      console.error("Error fetching project workspace:", error);
      throw new Error("Failed to fetch project workspace");
    }
  },
});

// Fetch chat messages for a project workspace
export const fetchProjectChatMessages = query({
  args: {
    projectId: v.id("projectWorkspaces"),
  },
  handler: async ({ db }, { projectId }) => {
    try {
      return await db.query("projectChats")
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .collect();
    } catch (error) {
      console.error("Error fetching project chat messages:", error);
      throw new Error("Failed to fetch project chat messages");
    }
  },
});

// Add a new chat message for a project workspace
export const addProjectChatMessage = mutation({
  args: {
    projectId: v.id("projectWorkspaces"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async ({ db }, { projectId, senderId, content }) => {
    try {
      return await db.insert("projectChats", {
        projectId,
        senderId,
        content,
      });
    } catch (error) {
      console.error("Error adding project chat message:", error);
      throw new Error("Failed to add project chat message");
    }
  },
});

// Add a new to-do for the project
export const addTodo = mutation({
  args: {
    projectId: v.id("projectWorkspaces"),
    creatorId: v.id("users"),
    content: v.string(),
    completed: v.boolean(),
  },
  handler: async (
    { db },
    { projectId, creatorId, content, completed }: { projectId: Id<"projectWorkspaces">; creatorId: Id<"users">; content: string; completed: boolean }
  ) => {
    try {
      return await db.insert("projectTodos", {
        projectId,
        creatorId,
        content,
        completed,
      });
    } catch (error) {
      console.error("Error adding to-do:", error);
      throw new Error("Failed to add to-do");
    }
  },
});

// Fetch GitHub logs (Placeholder function for now)
export const fetchGitHubLogs = query({
  args: {
    repoUrl: v.string(),
  },
  handler: async ({ db }, { repoUrl }: { repoUrl: string }) => {
    // Placeholder - would call GitHub API here if integrated
    return [
      { message: "Initial commit", date: "2023-01-01" },
      { message: "Added README", date: "2023-01-02" },
    ];
  },
});
