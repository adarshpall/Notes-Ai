
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ isAuth, onLogout }) {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">NotesAI</h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuth && (
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
