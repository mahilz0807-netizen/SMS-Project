import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { admin } = useAuth();

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}