import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const signIn = useAction(api.auth.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ 
        params: {
          username,
          password,
          create: isSignUp
        }
      });
    } catch (error) {
      console.error(error);
      alert("Error signing in. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <div>
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Username"
        />
      </div>
      <div>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full p-2 text-blue-500 hover:text-blue-600"
      >
        {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
      </button>
    </form>
  );
}
