import { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTransition } from "../../animations/pageTransitions";

const API_URL = "http://localhost:5000";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const getStudentImage = (student) => {
    if (student.image_url) return student.image_url;
    if (student.image) return `${API_URL}${student.image}`;
    if (student.photo_url) return student.photo_url;
    if (student.photo) return `${API_URL}${student.photo}`;
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentsRes = await api.get("/students");
        const attendanceRes = await api.get("/attendance");

        setStudents(studentsRes.data || []);
        setRecords(attendanceRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const courses = [...new Set(students.map((s) => s.course).filter(Boolean))];

  const filteredStudents = students.filter(
    (student) => student.course === selectedCourse
  );

  const filteredRecords = records.filter((record) => {
    const student = students.find((s) => s.id === record.student_id);
    return student?.course === selectedCourse;
  });

  const presentCount = filteredStudents.filter(
    (student) => (attendance[student.id] || "present") === "present"
  ).length;

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return alert("Please select a course.");
    if (!date) return alert("Please select a date.");

    try {
      setLoading(true);

      for (const student of filteredStudents) {
        await api.post("/attendance", {
          student_id: student.id,
          date,
          status: attendance[student.id] || "present",
        });
      }

      alert("Attendance saved successfully!");

      const res = await api.get("/attendance");
      setRecords(res.data || []);

      setDate("");
      setAttendance({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold dark:text-white">
            Attendance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Mark and track course-wise student attendance.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-6"
        >
          <h2 className="font-bold dark:text-white text-base">
            Mark Attendance
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Course
              </label>

              <select
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setAttendance({});
                }}
                required
              >
                <option value="">Select Course</option>

                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Date
              </label>

              <input
                type="date"
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Summary
              </label>

              <div className="flex gap-3">
                <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                  <p className="text-green-600 dark:text-green-400 text-xl font-bold">
                    {presentCount}
                  </p>
                  <p className="text-green-600/70 text-xs">Present</p>
                </div>

                <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                  <p className="text-red-600 dark:text-red-400 text-xl font-bold">
                    {filteredStudents.length - presentCount}
                  </p>
                  <p className="text-red-600/70 text-xs">Absent</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {!selectedCourse && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-500">
                      Select a course to see students.
                    </td>
                  </tr>
                )}

                {selectedCourse && filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-500">
                      No students enrolled in this course.
                    </td>
                  </tr>
                )}

                {filteredStudents.map((student, idx) => {
                  const status = attendance[student.id] || "present";
                  const imageSrc = getStudentImage(student);

                  return (
                    <tr
                      key={student.id}
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-3 text-slate-500">{idx + 1}</td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={student.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                              {student.full_name?.[0] || "S"}
                            </div>
                          )}

                          <span className="font-semibold dark:text-white">
                            {student.full_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-slate-500">
                        {student.email}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setAttendance({
                                ...attendance,
                                [student.id]: "present",
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              status === "present"
                                ? "bg-green-500 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-green-100"
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setAttendance({
                                ...attendance,
                                [student.id]: "absent",
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              status === "absent"
                                ? "bg-red-500 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            disabled={loading || filteredStudents.length === 0}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Attendance"
            )}
          </button>
        </form>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold dark:text-white">
              Attendance Records {selectedCourse && `— ${selectedCourse}`}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-left">Date</th>
                  <th className="px-5 py-4 text-left">Student</th>
                  <th className="px-5 py-4 text-left">Course</th>
                  <th className="px-5 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {!selectedCourse && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-500">
                      Select a course to view records.
                    </td>
                  </tr>
                )}

                {selectedCourse && filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-500">
                      No attendance records for this course.
                    </td>
                  </tr>
                )}

                {selectedCourse &&
                  filteredRecords.map((item) => {
                    const student = students.find(
                      (s) => s.id === item.student_id
                    );

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-5 py-3 dark:text-white font-mono text-xs">
                          {item.date}
                        </td>

                        <td className="px-5 py-3 font-semibold dark:text-white">
                          {student?.full_name || "Unknown"}
                        </td>

                        <td className="px-5 py-3 text-slate-500">
                          {student?.course || "N/A"}
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === "present"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}