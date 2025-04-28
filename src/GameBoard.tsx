import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function GameBoard() {
  const gameState = useQuery(api.games.getGameState);
  const makeMove = useMutation(api.games.makeMove);

  const handleClick = async (boardIndex: number, position: number) => {
    try {
      await makeMove({ boardIndex, position });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!gameState) return null;

  const { boards, innerWinners, status, currentTurn, activeBoard } = gameState;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold mb-4">
        {status === "playing" ? (
          `Current Turn: ${currentTurn}`
        ) : status === "won" && gameState.winner ? (
          `Winner: ${gameState.winner}`
        ) : (
          "Game Over - Draw!"
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl">
        {boards.map((board, boardIndex) => (
          <div
            key={boardIndex}
            className={`relative bg-white p-2 rounded-lg ${
              activeBoard === -1 || activeBoard === boardIndex
                ? "ring-2 ring-indigo-500"
                : ""
            }`}
          >
            {innerWinners[boardIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <span className="text-6xl font-bold text-indigo-600">
                  {innerWinners[boardIndex]}
                </span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-1">
              {board.map((cell, position) => (
                <button
                  key={position}
                  className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                  onClick={() => handleClick(boardIndex, position)}
                  disabled={status !== "playing" || (activeBoard !== -1 && activeBoard !== boardIndex)}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
