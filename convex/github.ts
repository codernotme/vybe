import { mutation, query } from '../convex/_generated/server';
import { v } from 'convex/values';

// Mutation to update GitHub info
export const linkGitHub = mutation({
  args: v.object({
    clerkId: v.string(),
    githubUsername: v.string(),
  }),
  handler: async ({ db }, { clerkId, githubUsername }) => {
    const user = await db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), clerkId))
      .first();

    if (user) {
      await db.patch(user._id, { githubUsername });
      return { success: true };
    }
    return { success: false, message: 'User not found' };
  },
});

// Mutation to select a repository and create a project workspace
export const selectRepo = mutation({
  args: v.object({
    userId: v.id('users'),
    repoName: v.string(),
    repoUrl: v.string(),
  }),
  handler: async ({ db }, { userId, repoName, repoUrl}) => {
    return db.insert('projectWorkspaces', {
      ownerId: userId,
      repoName,
      repoUrl,
      techStack: [],
      status: 'active',
    });
  },
});
