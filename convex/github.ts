import { mutation, query } from '../convex/_generated/server';
import { v } from 'convex/values';

// Mutation to update GitHub info
export const linkGitHub = mutation({
  args: {
    clerkId: v.string(),
    githubUsername: v.string(),
  },
  handler: async ({ db }, { clerkId, githubUsername }) => {
  const user = await db.query('users').filter(q => q.eq(q.field('clerkId'), clerkId)).first();
    if (user) {
      await db.patch(user._id, {
        githubUsername
      });
    }
  }
});

// Query to fetch GitHub repositories
export const getGitHubRepos = query(async ({}, { githubUsername }) => {
  const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
  if (!response.ok) throw new Error('Failed to fetch GitHub repositories');
  const repos = await response.json();
  return repos;
});
