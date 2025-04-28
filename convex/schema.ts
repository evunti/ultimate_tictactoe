import { defineSchema, defineTable } from "convex/server"; // ✅ Correct import path
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  games: defineTable({
    boards: v.optional(v.array(v.array(v.string()))),
    board: v.optional(v.array(v.string())),
    currentTurn: v.string(),
    activeBoard: v.optional(v.number()),
    innerWinners: v.optional(v.array(v.string())),
    status: v.string(),
    winner: v.optional(v.union(v.string(), v.null())),
    playerX: v.optional(v.string()),
    playerO: v.optional(v.string()),
  }),
});
