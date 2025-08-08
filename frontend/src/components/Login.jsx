
// import { useState } from "react";
// import api from "../api";
// import toast from "react-hot-toast";

// export default function Login({ onAuth }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast.error("Please enter email and password");
//       return;
//     }

//     try {
//       const res = await api.post("/auth/login", { email, password });
//       localStorage.setItem("token", res.data.token);
//       toast.success(" Login successful!");
//       onAuth();
//     } catch (err) {
//       toast.error(" Login failed");
//     }
//   };

//   return (
//     <div className="p-6 space-y-4 dark:text-white">
//       <h2 className="text-xl font-semibold">Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button
//         onClick={handleLogin}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Log In
//       </button>
//     </div>
//   );
// }
import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      // ✅ Save token + user info
      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);

      toast.success("Login successful!");
      onAuth();
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="p-6 space-y-4 dark:text-white">
      <h2 className="text-xl font-semibold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 rounded dark:bg-gray-800 dark:border-gray-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
    </div>
  );
}
