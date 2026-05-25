import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import api from "../../services/api";
import { PageTransition } from "../../animations/pageTransitions";

const emptyForm = {
  title: "",
  code: "",
  duration: "",
  fee: "",
  description: "",
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.code) {
      return alert("Course Name and Course No are required");
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        alert("Course updated successfully");
      } else {
        await api.post("/courses", form);
        alert("Course added successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (course) => {
    setEditingId(course.id);

    setForm({
      title: course.title || "",
      code: course.code || "",
      duration: course.duration || "",
      fee: course.fee || "",
      description: course.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const removeCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      alert("Course deleted successfully");
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold dark:text-white">
            Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Add, edit and delete course details.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold dark:text-white">
              {editingId ? "Edit Course" : "Add New Course"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1 text-sm text-red-500 font-semibold"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter Course Name"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Enter Course No"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Type Duration e.g. 6 Months"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              placeholder="Type Course Fee"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Type Description"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 lg:col-span-3"
            />
          </div>

          <button
            disabled={loading}
            className={`mt-5 w-full ${
              editingId
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition`}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Course"
              : "+ Add Course"}
          </button>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <div className="flex justify-between gap-3">
                <h2 className="text-lg font-bold dark:text-white">
                  {course.title}
                </h2>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(course)}
                    className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => removeCourse(course.id)}
                    className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                <b>Course No:</b> {course.code}
              </p>

              {course.duration && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <b>Duration:</b> {course.duration}
                </p>
              )}

              {course.fee && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <b>Fee:</b> Rs. {course.fee}
                </p>
              )}

              {course.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}