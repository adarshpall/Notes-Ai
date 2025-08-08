
import { useState } from "react";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(true); // toggle login/signup

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  const handleAuthSuccess = () => {
    setIsAuth(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <Navbar onLogout={handleLogout} isAuth={isAuth} />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {!isAuth ? (
          showLogin ? (
            <>
              <Login onAuth={handleAuthSuccess} />
              <p className="text-sm mt-2">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => setShowLogin(false)}
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <Signup onAuth={handleAuthSuccess} />
              <p className="text-sm mt-2">
                Already have an account?{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={() => setShowLogin(true)}
                >
                  Log in
                </button>
              </p>
            </>
          )
        ) : (
          <>
            <FileUpload />
            <ChatWindow />
          </>
        )}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
