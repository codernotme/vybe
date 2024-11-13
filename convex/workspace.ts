import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Checks if a user is authorized for a specific project.
 */
export const isUserAuthorizedForProject = async (
  ctx: QueryCtx | MutationCtx,
  projectId: Id<"projectWorkspaces">,
  userId: Id<"users">
): Promise<boolean> => {
  try {
    // Check if the user is the project owner
    const project = await ctx.db.get(projectId);
    if (project?.ownerId === userId) return true;

    // Check if the user is a member of the project
    const member = await ctx.db
      .query("projectMembers")
      .filter((q) =>
        q.and(
          q.eq(q.field("projectId"), projectId),
          q.eq(q.field("memberId"), userId)
        )
      )
      .first();

    return !!member;
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return false;
  }
};

// Fetch all project workspaces
export const getProjectWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await ctx.db.query("projectWorkspaces").collect();
    } catch (error) {
      console.error("Error fetching project workspaces:", error);
      throw new Error("Failed to fetch project workspaces");
    }
  },
});

// Fetch a specific project workspace with authorization check
export const getProjectWorkspace = query({
  args: {
    projectId: v.id("projectWorkspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, { projectId, userId }) => {
    const isAuthorized = await isUserAuthorizedForProject(ctx, projectId, userId);
    if (!isAuthorized) return null;

    return await ctx.db.get(projectId);
  },
});

// Fetch chat messages for a project workspace
export const fetchProjectChatMessages = query({
  args: {
    projectId: v.id("projectWorkspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, { projectId, userId }) => {
    const isAuthorized = await isUserAuthorizedForProject(ctx, projectId, userId);
    if (!isAuthorized) return null;

    return await ctx.db
      .query("projectChats")
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .collect();
  },
});

// Add a new chat message to a project workspace
export const addProjectChatMessage = mutation({
  args: {
    projectId: v.id("projectWorkspaces"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, { projectId, senderId, content }) => {
    const isAuthorized = await isUserAuthorizedForProject(ctx, projectId, senderId);
    if (!isAuthorized) return null;

    return await ctx.db.insert("projectChats", {
      projectId,
      senderId,
      content,
    });
  },
});

// Add a new to-do item to a project
export const addTodo = mutation({
  args: {
    projectId: v.id("projectWorkspaces"),
    creatorId: v.id("users"),
    content: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, { projectId, creatorId, content, completed }) => {
    try {
      return await ctx.db.insert("projectTodos", {
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

// Fetch GitHub logs (Placeholder function)
export const fetchGitHubLogs = query({
  args: {
    repoUrl: v.string(),
  },
  handler: async (_ctx, { repoUrl }) => {
    // Placeholder - would call GitHub API here if integrated
    return [
      { message: "Initial commit", date: "2023-01-01" },
      { message: "Added README", date: "2023-01-02" },
    ];
  },
});

// Invite a user to a project workspace
export const inviteUser = mutation({
  args: {
    projectId: v.id("projectWorkspaces"),
    email: v.string(),
  },
  handler: async (ctx, { projectId, email }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    if (user) {
      await ctx.db.insert("projectMembers", {
        projectId,
        memberId: user._id,
        role: "tech",
      });
      return { message: "User invited successfully" };
    } else {
      console.error("User not found:", email);
      throw new Error("User not found");
    }
  },
});

// Allow users to leave a workspace
// export const leaveWorkspace = mutation({
//   args: { projectId: v.id("projectWorkspaces"), userId: v.id("users") },
//   handler: async (ctx, { projectId, userId }) => {
//     try {
//       await ctx.db
//         .query("projectMembers")
//         .filter((q) =>
//           q.and(
//             q.eq(q.field("projectId"), projectId),
//             q.eq(q.field("memberId"), userId)
//           )
//         )
//         .remove();
//     } catch (error) {
//       console.error("Error leaving workspace:", error);
//       throw new Error("Failed to leave workspace");
//     }
//   },
// });




// Fetch all workspaces that a user is a member of or owns
export const getUserWorkspaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      // Fetch workspaces owned by the user
      const ownedProjects = await ctx.db
        .query("projectWorkspaces")
        .filter((q) => q.eq(q.field("ownerId"), userId))
        .collect();

      // Fetch workspaces the user is a member of
      const memberProjects = await ctx.db
        .query("projectMembers")
        .filter((q) => q.eq(q.field("memberId"), userId))
        .collect(); // Collect the results into an array first

      // Map over collected results to fetch project details
      const projects = await Promise.all(
        memberProjects.map(async (member: { projectId: Id<"projectWorkspaces"> }) => 
          await ctx.db.get(member.projectId)
        )
      );

      // Combine owned and member projects
      return [...ownedProjects, ...projects];
    } catch (error) {
      console.error("Error fetching user workspaces:", error);
      throw new Error("Failed to fetch user workspaces");
    }
  },
});

