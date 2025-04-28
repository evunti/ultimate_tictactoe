import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const makeMove = mutation({
  args: {
    boardIndex: v.number(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get or create the game
    let game = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "playing"))
      .first();

    if (!game) {
      // Create a new game if none exists
      const emptyBoard = Array(9).fill("");
      const boards = Array(9)
        .fill(null)
        .map(() => [...emptyBoard]);

      const gameId = await ctx.db.insert("games", {
        boards,
        currentTurn: "X",
        activeBoard: -1,
        innerWinners: Array(9).fill(""),
        status: "playing",
        winner: null,
      });
      game = await ctx.db.get(gameId);
      if (!game) throw new Error("Failed to create game");
    }

    const { boardIndex, position } = args;

    // Initialize boards and innerWinners if they don't exist
    const boards =
      game.boards ??
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(""));
    const innerWinners = game.innerWinners ?? Array(9).fill("");
    const activeBoard = game.activeBoard ?? -1;
    const currentPlayer = game.currentTurn;

    // Validate board selection
    if (activeBoard !== -1 && activeBoard !== boardIndex) {
      throw new Error("Must play in the active board");
    }

    // Check if the selected board is already won
    if (innerWinners[boardIndex] !== "") {
      throw new Error("This board is already completed");
    }

    // Check if the position is already taken
    if (boards[boardIndex][position] !== "") {
      throw new Error("Position already taken");
    }

    // Make the move
    const newBoards = boards.map((board: string[], index: number) =>
      index === boardIndex
        ? board.map((cell: string, pos: number) =>
            pos === position ? currentPlayer : cell
          )
        : board
    );

    // Check if this move won the inner board
    const newInnerWinners = [...innerWinners];
    const innerWinner = checkWinner(newBoards[boardIndex]);
    if (innerWinner) {
      newInnerWinners[boardIndex] = innerWinner;
    }

    // Check if this move won the game
    const winner = checkWinner(newInnerWinners);
    const isDraw = !winner && newInnerWinners.every((w) => w !== "");

    // The next active board is determined by the position played
    // If that board is already won, allow play in any board
    let nextActiveBoard = position;
    if (newInnerWinners[nextActiveBoard] !== "") {
      nextActiveBoard = -1;
    }

    await ctx.db.patch(game._id, {
      boards: newBoards,
      currentTurn: currentPlayer === "X" ? "O" : "X",
      activeBoard: nextActiveBoard,
      innerWinners: newInnerWinners,
      status: winner ? "won" : isDraw ? "draw" : "playing",
      winner: winner,
    });
  },
});

export const getGameState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const game = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "playing"))
      .first();

    if (!game) {
      return {
        boards: Array(9)
          .fill(null)
          .map(() => Array(9).fill("")),
        innerWinners: Array(9).fill(""),
        activeBoard: -1,
        currentTurn: "X",
        status: "playing",
        winner: null,
      };
    }

    return {
      boards:
        game.boards ??
        Array(9)
          .fill(null)
          .map(() => Array(9).fill("")),
      innerWinners: game.innerWinners ?? Array(9).fill(""),
      activeBoard: game.activeBoard ?? -1,
      currentTurn: game.currentTurn,
      status: game.status,
      winner: game.winner ?? null,
    };
  },
});

function checkWinner(board: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
