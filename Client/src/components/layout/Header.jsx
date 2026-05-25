import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm">
      <div className="md:hidden">
        <span className="text-white font-bold">Menu</span>
      </div>

      <h2 className="font-bold text-slate-800 dark:text-white hidden md:block">
        Student Management System
      </h2>

      <div className="flex gap-3 items-center">


        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {(admin?.name || "A")[0].toUpperCase()}
          </div>
          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {admin?.name || "Admin"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}