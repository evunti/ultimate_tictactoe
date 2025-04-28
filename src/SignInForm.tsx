import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const signIn = useAction(api.auth.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({
        provider: "password",
        params: {
          username: email, // Must be called `username`, not `email`
          password,
          flow: isSignUp ? "signUp" : "signIn", // Add the `flow` parameter
        },
      });

      alert(
        isSignUp
          ? "Account created! You are now signed in."
          : "Signed in successfully!"
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Authentication failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <div>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Email"
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
        {isSignUp
          ? "Already have an account? Sign In"
          : "Need an account? Sign Up"}
      </button>
    </form>
  );
}
