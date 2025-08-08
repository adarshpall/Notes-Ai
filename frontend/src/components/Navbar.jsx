
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ isAuth, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAvatarClick = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setEmail(localStorage.getItem("email") || "");
  }, [isAuth]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">NotesAI</h1>

        <div className="flex items-center gap-4 relative">
          <ThemeToggle />

          {isAuth && (
            <div className="relative dropdown-wrapper">
              <div
                className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white cursor-pointer"
                onClick={handleAvatarClick}
                title={name}
              >
                {name?.charAt(0).toUpperCase() || "U"}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-lg rounded p-3 z-50 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs break-all">{email}</p>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      setShowDropdown(false); 
                      onLogout();
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
