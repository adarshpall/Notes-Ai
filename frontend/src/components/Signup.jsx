
import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Signup({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email || !password) {
      toast.error(" Please fill in all fields");
      return;
    }

    if (!gmailRegex.test(email)) {
      toast.error(" Please enter a valid Gmail address");
      return;
    }

    if (password.length < 6) {
      toast.error(" Password must be at least 6 characters");
      return;
    }

    try {
      const res = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success(" Signup successful!");
      onAuth();
    } catch (err) {
      toast.error(" Signup failed");
    }
  };

  return (
    <div className="p-6 space-y-4 dark:text-white">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Signup</h2>

      <input
        type="email"
        placeholder="Enter your Gmail address"
        className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 6 characters)"
        className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Sign Up
      </button>
    </div>
  );
}

