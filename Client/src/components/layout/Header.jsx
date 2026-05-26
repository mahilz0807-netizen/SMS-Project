import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

export default function Header() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminImage, setAdminImage] = useState("");

  useEffect(() => {
    const savedImage = localStorage.getItem("adminImage");
    if (savedImage) {
      setAdminImage(savedImage);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setAdminImage(imageUrl);
    localStorage.setItem("adminImage", imageUrl);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm">
      
      <div className="md:hidden">
        <span className="text-slate-800 dark:text-white font-bold">
          Menu
        </span>
      </div>

      <h2 className="font-bold text-slate-800 dark:text-white hidden md:block">
        Student Management System
      </h2>

      <div className="relative flex gap-3 items-center">

        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          {adminImage ? (
            <img
              src={adminImage}
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {(admin?.name || "A")[0].toUpperCase()}
            </div>
          )}

          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {admin?.name || "Admin"}
          </span>
        </button>

        {showAdmin && (
          <div className="absolute right-24 top-14 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-5 z-50">
            
            <div className="flex flex-col items-center text-center">
              
              <div className="relative">
                {adminImage ? (
                  <img
                    src={adminImage}
                    alt="Admin"
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {(admin?.name || "A")[0].toUpperCase()}
                  </div>
                )}

                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-white">
                {admin?.name || "Admin"}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {admin?.email || "admin@example.com"}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Role</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  Admin
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-green-600">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

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