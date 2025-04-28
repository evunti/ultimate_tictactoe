import { v } from "convex/values";
import { query } from "./_generated/server";

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
