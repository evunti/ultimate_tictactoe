import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = useAction(api.auth.signIn);

  // Live validation
  const emailIsValid = email.length > 0 && email.includes("@");
  const passwordIsValid =
    password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  const formIsValid = emailIsValid && passwordIsValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formIsValid) {
      alert(
        "Please enter a valid email and a password with at least 8 characters, including letters and numbers."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await signIn({
        provider: "password",
        params: {
          id: email,
          secret: password,
          flow: isSignUp ? "signUp" : "signIn",
        },
      });

      alert(
        isSignUp
          ? "Account created! You are now signed in."
          : "Signed in successfully!"
      );
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Invalid password")) {
        alert(
          "Password must be at least 8 characters, with letters and numbers."
        );
      } else {
        alert(error.message || "Authentication failed.");
      }
    } finally {
      setIsSubmitting(false);
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
        {!emailIsValid && email.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            Enter a valid email address.
          </p>
        )}
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
        {!passwordIsValid && password.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            Password must be at least 8 characters, with letters and numbers.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!formIsValid || isSubmitting}
        className={`w-full p-2 rounded text-white ${formIsValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {isSubmitting ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
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
