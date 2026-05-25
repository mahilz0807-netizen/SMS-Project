import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const { admin } = useAuth();

  const [studentOpen, setStudentOpen] = useState(true);
  const [courseOpen, setCourseOpen] = useState(true);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const subLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-500/20 text-blue-300"
        : "text-slate-500 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 hidden md:flex flex-col p-6">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">
            LT
          </div>

          <div>
            <h1 className="text-white font-extrabold text-lg leading-none">
              Little Tech
            </h1>
            <p className="text-slate-500 text-xs mt-1">Academy</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <NavLink to="/dashboard" end className={linkClass}>
          <span>▣</span>
          <span>Dashboard</span>
        </NavLink>

        {/* Students */}
        <button
          type="button"
          onClick={() => setStudentOpen(!studentOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <span className="flex items-center gap-3">
            <span>◈</span>
            <span>Students</span>
          </span>

          <span>{studentOpen ? "−" : "+"}</span>
        </button>

        {studentOpen && (
          <div className="ml-6 space-y-2 border-l border-slate-800 pl-4">
            <NavLink to="/dashboard/students/Form" className={subLinkClass}>
              Student Admission Form
            </NavLink>

            <NavLink to="/dashboard/students/records" className={subLinkClass}>
              Student Records
            </NavLink>

            <NavLink to="/dashboard/students/dropout" className={subLinkClass}>
              Dropout Students Details
            </NavLink>
          </div>
        )}

        {/* Courses */}
        <button
          type="button"
          onClick={() => setCourseOpen(!courseOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <span className="flex items-center gap-3">
            <span>◉</span>
            <span>Courses</span>
          </span>

          <span>{courseOpen ? "−" : "+"}</span>
        </button>

        {courseOpen && (
          <div className="ml-6 space-y-2 border-l border-slate-800 pl-4">
            <NavLink to="/dashboard/course" className={subLinkClass}>
              Course Details
            </NavLink>
          </div>
        )}

        <NavLink to="/dashboard/attendance" className={linkClass}>
          <span>◎</span>
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/dashboard/results" className={linkClass}>
          <span>◆</span>
          <span>Results</span>
        </NavLink>

        <NavLink to="/dashboard/notifications" className={linkClass}>
          <span>✉</span>
          <span>Notifications</span>
        </NavLink>
      </nav>

      {/* Admin Profile */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {(admin?.name || admin?.email || "A")[0].toUpperCase()}
          </div>

          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">
              {admin?.name || "Admin"}
            </p>

            <p className="text-slate-500 text-xs truncate">
              {admin?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}