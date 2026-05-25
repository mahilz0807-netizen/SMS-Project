import { useEffect, useState } from "react";
import { PageTransition } from "../../animations/pageTransitions";
import StatsCard from "../../components/cards/StatsCard";
import api from "../../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [studentsRes, coursesRes, attendanceRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
        api.get("/attendance"),
      ]);

      setStudents(studentsRes.data?.data || studentsRes.data || []);
      setCourses(coursesRes.data?.data || coursesRes.data || []);
      setAttendance(attendanceRes.data?.data || attendanceRes.data || []);
    } catch (error) {
      console.error("Dashboard data loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.filter((item) => {
    const date =
      item.date ||
      item.attendance_date ||
      item.created_at ||
      item.createdAt ||
      "";

    return String(date).startsWith(today);
  });

  const todayPresent = todayAttendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const todayAbsent = todayAttendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const todayLate = todayAttendance.filter(
    (item) => item.status?.toLowerCase() === "late"
  ).length;

  const presentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "late"
  ).length;

  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const courseGraphData = courses.map((course) => {
    const title = course.title || course.course_name || course.name || "Course";

    const studentCount = students.filter(
      (student) => student.course === title
    ).length;

    return {
      course: title,
      students: studentCount,
    };
  });

  const attendanceGraphData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
    { name: "Late", value: lateCount },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

  const tooltipStyle = {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    color: "#f8fafc",
    fontSize: "12px",
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-2xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
                Student Management Portal
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
                My Courses & Attendance Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                View student count, course count and attendance summary with
                clean professional graphs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <p className="text-xs text-slate-300">Today</p>
              <p className="mt-1 text-lg font-bold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={loading ? "—" : students.length}
            icon="👨‍🎓"
            color="blue"
            trend="Registered students"
          />

          <StatsCard
            title="Total Courses"
            value={loading ? "—" : courses.length}
            icon="📚"
            color="indigo"
            trend="Available courses"
          />

          <StatsCard
            title="Attendance Rate"
            value={loading ? "—" : `${attendanceRate}%`}
            icon="📅"
            color="green"
            trend="Present percentage"
          />

          <StatsCard
            title="Today Records"
            value={loading ? "—" : todayAttendance.length}
            icon="📝"
            color="purple"
            trend="Today attendance"
          />
        </section>

         <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Course Wise Student Graph
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Number of students registered for each course.
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseGraphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="course"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="students"
                    fill="#3b82f6"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Student Attendance Graph
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Present, absent and late attendance summary.
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceGraphData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label
                  >
                    {attendanceGraphData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              Today Summary
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Daily attendance overview
            </p>
          </div>

          <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-500/20 dark:bg-green-500/10">
            <p className="text-sm font-bold text-green-600 dark:text-green-400">
              Present Today
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              {todayPresent}
            </h2>
          </div>

          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-500/20 dark:bg-red-500/10">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              Absent Today
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              {todayAbsent}
            </h2>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              Late Today
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              {todayLate}
            </h2>
          </div>
        </section>

       
      </div>
    </PageTransition>
  );
}