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
      .filter(q => q.eq(q.field('clerkId'), clerkId))
      .first();

    if (user) {
      await db.patch(user._id, { githubUsername });
      return { success: true };
    }
    return { success: false, message: 'User not found' };
  },
}); 
