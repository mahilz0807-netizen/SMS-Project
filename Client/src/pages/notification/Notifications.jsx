import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Notifications() {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    course: "",
    type: "Notification",
    title: "",
    message: "",
  });

  const loadData = async () => {
    try {
      const [studentRes, notificationRes] = await Promise.all([
        api.get("/students"),
        api.get("/notifications"),
      ]);

      const studentData = Array.isArray(studentRes.data)
        ? studentRes.data
        : studentRes.data?.data || [];

      const notificationData = Array.isArray(notificationRes.data)
        ? notificationRes.data
        : notificationRes.data?.data || [];

      setStudents(studentData);
      setNotifications(notificationData);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const courses = [
    ...new Set(
      students
        .map((s) => s.course || s.course_name || s.courseTitle || "")
        .filter(Boolean)
    ),
  ];

  const selectedCourseStudents = students.filter(
    (s) =>
      (s.course || s.course_name || s.courseTitle) === form.course
  );

  const submit = async (e) => {
    e.preventDefault();

    if (!form.course) return alert("Please select course");
    if (!form.title) return alert("Please enter title");
    if (!form.message) return alert("Please enter message");

    try {
      setLoading(true);

      const res = await api.post("/notifications/send", form);

      alert(res.data?.message || "Notification sent successfully");

      setForm({
        course: "",
        type: "Notification",
        title: "",
        message: "",
      });

      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Course Notifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Send assignment, instruction or notification to selected course
          students.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={submit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">
            Send New Message
          </h2>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Course
            </label>

            <select
              value={form.course}
              onChange={(e) =>
                setForm({
                  ...form,
                  course: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Choose Course</option>

              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))
              ) : (
                <option disabled>No Courses Available</option>
              )}
            </select>
          </div>

          {form.course && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300">
              {selectedCourseStudents.length} students will receive this email.
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Message Type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Notification">Notification</option>
              <option value="Assignment">Assignment</option>
              <option value="Instruction">Instruction</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>

            <input
              type="text"
              placeholder="Example: React Assignment"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>

            <textarea
              rows="6"
              placeholder="Write your message..."
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-60 transition"
          >
            {loading ? "Sending..." : "Send Email Notification"}
          </button>
        </form>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-4">
            Previous Notifications
          </h2>

          <div className="space-y-3 max-h-[520px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
                >
                  <div className="flex justify-between gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>

                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {n.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    Course: {n.course}
                  </p>

                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">
                    {n.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-3">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleString()
                      : "No date"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}