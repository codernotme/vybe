import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUserRole = mutation({
  args: { githubId: v.string(), githubUsername: v.string() },
  handler: async ({ db }, { githubId, githubUsername }) => {
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("githubId"), githubId))
      .first();

    if (user) {
      await db.patch(user._id, { role: "tech", githubUsername });
      return { success: true, message: "Role updated successfully." };
    } else {
      return { success: false, message: "User not found." };
    }
  },
});
