import { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTransition } from "../../animations/pageTransitions";

const API_URL = "http://localhost:5000";

const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
];

const gradeInfo = {
  A: {
    text: "text-green-700 dark:text-green-300",
    bg: "bg-green-100 dark:bg-green-900/50",
    border: "border-green-400 dark:border-green-500",
    label: "Excellent",
  },
  B: {
    text: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-900/50",
    border: "border-blue-400 dark:border-blue-500",
    label: "Good",
  },
  C: {
    text: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-900/50",
    border: "border-orange-400 dark:border-orange-500",
    label: "Average",
  },
  S: {
    text: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-100 dark:bg-purple-900/50",
    border: "border-purple-400 dark:border-purple-500",
    label: "Pass",
  },
  F: {
    text: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-900/50",
    border: "border-red-400 dark:border-red-500",
    label: "Fail",
  },
};

function calcGrade(marks) {
  const m = Number(marks);

  if (m >= 75) return "A";
  if (m >= 65) return "B";
  if (m >= 55) return "C";
  if (m >= 45) return "S";

  return "F";
}

function getStudentImage(student) {
  if (!student) return null;

  if (student.image_url) return student.image_url;
  if (student.image) return `${API_URL}${student.image}`;
  if (student.photo_url) return student.photo_url;
  if (student.photo) return `${API_URL}${student.photo}`;

  return null;
}

export default function Results() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    student_id: "",
    student_name: "",
    student_email: "",
    subject: "",
    marks: "",
    semester: "",
  });

  const load = async () => {
    try {
      const [studentRes, resultRes] = await Promise.all([
        api.get("/students"),
        api.get("/results"),
      ]);

      setStudents(Array.isArray(studentRes.data) ? studentRes.data : []);
      setResults(Array.isArray(resultRes.data) ? resultRes.data : []);
    } catch (err) {
      console.error("LOAD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const courses = [...new Set(students.map((s) => s.course).filter(Boolean))];

  const filteredStudents = selectedCourse
    ? students.filter((s) => s.course === selectedCourse)
    : [];

  const handleCourseChange = (course) => {
    setSelectedCourse(course);

    setForm({
      student_id: "",
      student_name: "",
      student_email: "",
      subject: course,
      marks: "",
      semester: "",
    });
  };

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => String(s.id) === String(studentId));

    if (!student) return;

    setForm((prev) => ({
      ...prev,
      student_id: student.id,
      student_name: student.full_name || student.student_name || student.name || "",
      student_email: student.email || student.student_email || "",
      subject: selectedCourse || student.course || "",
    }));
  };

  const getStudentName = (result) => {
    if (result.student_name) return result.student_name;
    if (result.full_name) return result.full_name;
    if (result.name) return result.name;

    const student = students.find(
      (s) => String(s.id) === String(result.student_id)
    );

    return student?.full_name || student?.student_name || student?.name || "No Name";
  };

  const getStudentEmail = (result) => {
    if (result.student_email) return result.student_email;
    if (result.email) return result.email;

    const student = students.find(
      (s) => String(s.id) === String(result.student_id)
    );

    return student?.email || "No Email";
  };

  const getStudentByResult = (result) => {
    return students.find((s) => String(s.id) === String(result.student_id));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return alert("Please select course");
    if (!form.student_id) return alert("Please select student");
    if (form.marks === "") return alert("Please enter marks");
    if (!form.semester) return alert("Please select semester");

    const marks = Number(form.marks);

    if (marks < 0 || marks > 100) {
      return alert("Marks must be between 0 and 100");
    }

    try {
      setLoading(true);

      const grade = calcGrade(marks);

      await api.post("/results", {
        student_id: form.student_id,
        student_name: form.student_name,
        student_email: form.student_email,
        subject: form.subject,
        marks,
        grade,
        semester: form.semester,
      });

      alert("Result added successfully");

      setSelectedCourse("");
      setForm({
        student_id: "",
        student_name: "",
        student_email: "",
        subject: "",
        marks: "",
        semester: "",
      });

      await load();
    } catch (err) {
      console.error("ADD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add result");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!id) return alert("Result ID missing");

    if (!window.confirm("Delete this result?")) return;

    try {
      setDeleteId(id);

      await api.delete(`/results/${id}`);

      setResults((prev) =>
        prev.filter((item) => String(item.id || item.result_id) !== String(id))
      );

      alert("Result deleted successfully");
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const grade = form.marks !== "" ? calcGrade(form.marks) : null;
  const info = grade ? gradeInfo[grade] : null;

  const selectedStudent = students.find(
    (s) => String(s.id) === String(form.student_id)
  );

  const selectedStudentImage = getStudentImage(selectedStudent);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Course Wise Results
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Select course, select student, enter marks and publish result.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <form
            onSubmit={submit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm"
          >
            <h2 className="font-bold text-slate-900 dark:text-white">
              Add Result
            </h2>

            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-xl"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <select
              value={form.student_id}
              onChange={(e) => handleStudentChange(e.target.value)}
              disabled={!selectedCourse}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-xl disabled:opacity-50"
              required
            >
              <option value="">
                {selectedCourse ? "Select Student" : "Select Course First"}
              </option>

              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name || student.student_name || student.name || "No Name"}
                </option>
              ))}
            </select>

            {form.student_id && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4">
                {selectedStudentImage ? (
                  <img
                    src={selectedStudentImage}
                    alt={form.student_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-300 dark:border-slate-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                    {form.student_name?.[0] || "S"}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm flex-1">
                  <div>
                    <p className="text-slate-500 text-xs">Student Name</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {form.student_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs">Student ID</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      #{form.student_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs">Course</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {form.subject}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs">Email</p>
                    <p className="text-slate-900 dark:text-white">
                      {form.student_email || "No Email"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              type="number"
              min="0"
              max="100"
              placeholder="Enter marks"
              value={form.marks}
              onChange={(e) => setForm({ ...form, marks: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-xl"
              required
            />

            {info && (
              <div className={`${info.bg} ${info.border} border rounded-2xl p-4`}>
                <p className={`text-3xl font-black ${info.text}`}>
                  Grade {grade}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  {form.marks} marks - {info.label}
                </p>
              </div>
            )}

            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-xl"
              required
            >
              <option value="">Select Semester</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Result"}
            </button>
          </form>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">
              Grading Scale
            </h2>

            <div className="space-y-3">
              {Object.entries(gradeInfo).map(([g, item]) => (
                <div
                  key={g}
                  className={`${item.bg} ${item.border} border rounded-xl p-4 flex items-center gap-4`}
                >
                  <div className={`text-2xl font-black ${item.text}`}>{g}</div>
                  <div>
                    <p className={`font-bold ${item.text}`}>{item.label}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {g === "A"
                        ? "75 - 100"
                        : g === "B"
                        ? "65 - 74"
                        : g === "C"
                        ? "55 - 64"
                        : g === "S"
                        ? "45 - 54"
                        : "0 - 44"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">
              All Results
            </h2>
            <span className="text-sm text-slate-500">
              {results.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4 text-left">Student</th>
                  <th className="px-5 py-4 text-left">Subject</th>
                  <th className="px-5 py-4 text-left">Marks</th>
                  <th className="px-5 py-4 text-left">Grade</th>
                  <th className="px-5 py-4 text-left">Semester</th>
                  <th className="px-5 py-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No results published yet.
                    </td>
                  </tr>
                ) : (
                  results.map((r) => {
                    const item = gradeInfo[r.grade] || gradeInfo.F;
                    const rowId = r.id || r.result_id;
                    const student = getStudentByResult(r);
                    const img = getStudentImage(student);

                    return (
                      <tr
                        key={rowId}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {img ? (
                              <img
                                src={img}
                                alt={getStudentName(r)}
                                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {getStudentName(r)?.[0] || "S"}
                              </div>
                            )}

                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {getStudentName(r)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {getStudentEmail(r)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {r.subject}
                        </td>

                        <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">
                          {r.marks}
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`${item.bg} ${item.text} ${item.border} border px-3 py-1 rounded-full font-black text-xs`}
                          >
                            {r.grade}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {r.semester}
                        </td>

                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => remove(rowId)}
                            disabled={deleteId === rowId}
                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-lg text-xs font-bold disabled:opacity-50"
                          >
                            {deleteId === rowId ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}