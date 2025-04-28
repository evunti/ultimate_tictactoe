import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { GameBoard } from "./GameBoard";

export default function App() {
  const gameState = useQuery(api.games.getGameState);

  if (!gameState) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Ultimate Tic Tac Toe</h1>
        <SignInForm />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Ultimate Tic Tac Toe</h1>
        <SignOutButton />
      </div>
      <GameBoard />
    </main>
  );
}
