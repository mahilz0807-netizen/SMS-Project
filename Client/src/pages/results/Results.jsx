import { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTransition } from "../../animations/pageTransitions";

const API_URL = "http://localhost:5000";

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
  if (student.image?.startsWith("http")) return student.image;
  if (student.image) return `${API_URL}${student.image}`;
  if (student.photo_url) return student.photo_url;
  if (student.photo?.startsWith("http")) return student.photo;
  if (student.photo) return `${API_URL}${student.photo}`;

  return null;
}

export default function Results() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    student_id: "",
    student_name: "",
    student_email: "",
    subject: "",
    marks: "",
    batch: "",
  });

  const load = async () => {
    try {
      const [studentRes, resultRes, courseRes] = await Promise.all([
        api.get("/students"),
        api.get("/results"),
        api.get("/courses"),
      ]);

      setStudents(
        Array.isArray(studentRes.data)
          ? studentRes.data
          : studentRes.data?.data || []
      );

      setResults(
        Array.isArray(resultRes.data)
          ? resultRes.data
          : resultRes.data?.data || []
      );

      setCourses(
        Array.isArray(courseRes.data)
          ? courseRes.data
          : courseRes.data?.data || []
      );
    } catch (err) {
      console.error("LOAD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredStudents = selectedCourse
    ? students.filter((s) => {
        if (Array.isArray(s.course)) {
          return s.course.includes(selectedCourse);
        }

        if (typeof s.course === "string") {
          return s.course
            .split(",")
            .map((item) => item.trim())
            .includes(selectedCourse);
        }

        return false;
      })
    : [];

  const handleCourseChange = (courseId) => {
    const course = courses.find((c) => String(c.id) === String(courseId));

    setSelectedCourseId(courseId);
    setSelectedCourse(course?.title || "");

    setForm({
      student_id: "",
      student_name: "",
      student_email: "",
      subject: course?.title || "",
      marks: "",
      batch: course?.batch || "",
    });
  };

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => String(s.id) === String(studentId));

    if (!student) return;

    setForm((prev) => ({
      ...prev,
      student_id: student.id,
      student_name:
        student.full_name || student.student_name || student.name || "",
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

    if (!selectedCourseId) return alert("Please select course");
    if (!form.batch) return alert("Batch not found for this course");
    if (!form.student_id) return alert("Please select student");
    if (form.marks === "") return alert("Please enter marks");

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
        batch: form.batch,
      });

      alert("Result added successfully");

      setSelectedCourseId("");
      setSelectedCourse("");

      setForm({
        student_id: "",
        student_name: "",
        student_email: "",
        subject: "",
        marks: "",
        batch: "",
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

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Select course, view batch, select student, enter marks and publish result.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <form
            onSubmit={submit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="mb-5 font-bold text-slate-900 dark:text-white">
              Add Result
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              >
                <option value="">Select Course</option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} {course.batch ? `- ${course.batch}` : ""}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={form.batch}
                readOnly
                placeholder="Batch"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <select
                value={form.student_id}
                onChange={(e) => handleStudentChange(e.target.value)}
                disabled={!selectedCourse}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              >
                <option value="">
                  {selectedCourse ? "Select Student" : "Select Course First"}
                </option>

                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name ||
                      student.student_name ||
                      student.name ||
                      "No Name"}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="Enter marks"
                value={form.marks}
                onChange={(e) =>
                  setForm({ ...form, marks: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            {form.student_id && (
              <div className="mt-5 flex flex-col gap-4 rounded-xl bg-slate-100 p-4 dark:bg-slate-800 md:flex-row md:items-center">
                {selectedStudentImage ? (
                  <img
                    src={selectedStudentImage}
                    alt={form.student_name}
                    className="h-16 w-16 rounded-2xl border border-slate-300 object-cover dark:border-slate-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">
                    {form.student_name?.[0] || "S"}
                  </div>
                )}

                <div className="grid flex-1 grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Student Name</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {form.student_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Student ID</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      #{form.student_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Course</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {form.subject}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Batch</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {form.batch || "-"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-slate-900 dark:text-white">
                      {form.student_email || "No Email"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {info && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${info.bg} ${info.border}`}
              >
                <p className={`text-3xl font-black ${info.text}`}>
                  Grade {grade}
                </p>

                <p className="text-slate-700 dark:text-slate-300">
                  {form.marks} marks - {info.label}
                </p>
              </div>
            )}

            <button
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Result"}
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              All Results
            </h2>

            <span className="text-sm text-slate-500">
              {results.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4 text-left">Student</th>
                  <th className="px-5 py-4 text-left">Subject</th>
                  <th className="px-5 py-4 text-left">Marks</th>
                  <th className="px-5 py-4 text-left">Grade</th>
                  <th className="px-5 py-4 text-left">Batch</th>
                  <th className="px-5 py-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-500"
                    >
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
                                className="h-10 w-10 rounded-full border border-slate-300 object-cover dark:border-slate-700"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
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
                            className={`${item.bg} ${item.text} ${item.border} rounded-full border px-3 py-1 text-xs font-black`}
                          >
                            {r.grade}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {r.batch || "-"}
                        </td>

                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => remove(rowId)}
                            disabled={deleteId === rowId}
                            className="rounded-lg border border-red-300 bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 disabled:opacity-50 dark:border-red-700 dark:bg-red-900/40 dark:text-red-300"
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