import { useEffect, useState } from "react";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";

const API_URL = "http://localhost:5000";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  nic: "",
  address: "",
  course: "",
  qualification: "",
  parent_name: "",
  parent_phone: "",
  parent_address: "",
  guardian_name: "",
  guardian_relation: "",
  guardian_phone: "",
  guardian_address: "",
};

export default function StudentList({ refresh }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  const [dropoutStudent, setDropoutStudent] = useState(null);
  const [dropoutReason, setDropoutReason] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refresh]);

  const openEdit = (student) => {
    setEditingStudent(student);
    setImageFile(null);

    setForm({
      full_name: student.full_name || student.student_name || "",
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
      dob: student.dob || "",
      nic: student.nic || "",
      address: student.address || "",
      course: student.course || "",
      qualification: student.qualification || "",
      parent_name: student.parent_name || "",
      parent_phone: student.parent_phone || "",
      parent_address: student.parent_address || "",
      guardian_name: student.guardian_name || "",
      guardian_relation: student.guardian_relation || "",
      guardian_phone: student.guardian_phone || "",
      guardian_address: student.guardian_address || "",
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key] ?? "");
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/students/${editingStudent.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student updated successfully");
      setEditingStudent(null);
      setForm(emptyForm);
      setImageFile(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const saveDropout = async (e) => {
  e.preventDefault();

  if (!dropoutStudent?.id) {
    return alert("Student details are required");
  }

  if (!dropoutReason.trim()) {
    return alert("Reason is required");
  }

  try {
    const dropoutData = {
      student_id: dropoutStudent.id,
      full_name:
        dropoutStudent.full_name ||
        dropoutStudent.student_name ||
        dropoutStudent.name ||
        "",
      email: dropoutStudent.email || "",
      phone: dropoutStudent.phone || "",
      gender: dropoutStudent.gender || "",
      dob: dropoutStudent.dob || null,
      nic: dropoutStudent.nic || "",
      address:
        dropoutStudent.address ||
        dropoutStudent.permanent_address ||
        dropoutStudent.current_address ||
        "",
      course: dropoutStudent.course || "",
      qualification: dropoutStudent.qualification || "",
      parent_name: dropoutStudent.parent_name || "",
      parent_phone: dropoutStudent.parent_phone || "",
      parent_address: dropoutStudent.parent_address || "",
      guardian_name: dropoutStudent.guardian_name || "",
      guardian_relation: dropoutStudent.guardian_relation || "",
      guardian_phone: dropoutStudent.guardian_phone || "",
      guardian_address: dropoutStudent.guardian_address || "",
      image:
        dropoutStudent.image ||
        dropoutStudent.image_url ||
        dropoutStudent.photo ||
        dropoutStudent.photo_url ||
        dropoutStudent.imageUrl ||
        "",
      reason: dropoutReason.trim(),
    };

    const res = await api.post("/dropout", dropoutData);

    if (res.data?.success) {
      await api.delete(`/students/${dropoutStudent.id}`);

      setStudents((prev) =>
        prev.filter((student) => student.id !== dropoutStudent.id)
      );

      alert("Student moved to dropout page");

      setDropoutStudent(null);
      setDropoutReason("");
    }
  } catch (err) {
    console.log("Dropout Error:", err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
        "Failed to move student"
    );
  }
};

  const remove = async (id) => {
    const confirmDelete = window.confirm("Delete this student permanently?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${id}`);

      setStudents((prev) => prev.filter((student) => student.id !== id));

      alert("Student deleted permanently");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const getImageSrc = (student) => {
    const img =
      student.image ||
      student.image_url ||
      student.photo ||
      student.photo_url ||
      student.imageUrl ||
      "";

    if (!img) return null;
    if (img.startsWith("http")) return img;

    return `${API_URL}${img.startsWith("/") ? img : "/" + img}`;
  };

  const courses = [...new Set(students.map((s) => s.course).filter(Boolean))];

  const filtered = students.filter((s) => {
    const name = s.full_name || s.student_name || "";
    const email = s.email || "";

    const matchSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchFilter = !filter || s.course === filter;

    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="h-16" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-slate-100 p-3 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Courses</option>

            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="flex items-center px-3 text-sm text-slate-500 dark:text-slate-400">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-950 text-xs uppercase text-slate-400">
                <th className="px-5 py-4 text-left">#</th>
                <th className="px-5 py-4 text-left">Student</th>
                <th className="px-5 py-4 text-left">Contact</th>
                <th className="px-5 py-4 text-left">Course</th>
                <th className="px-5 py-4 text-left">Gender</th>
                <th className="px-5 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => {
                  const imageSrc = getImageSrc(s);
                  const studentName =
                    s.full_name || s.student_name || s.name || "No Name";

                  return (
                    <tr
                      key={s.id}
                      className="border-t border-slate-100 text-blue-500 dark:border-slate-800"
                    >
                      <td className="px-5 py-4 text-sm">{idx + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={studentName}
                              className="h-10 w-10 rounded-full border border-slate-300 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                              {studentName?.[0]?.toUpperCase() || "S"}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">{studentName}</p>
                            <p className="text-xs text-slate-400">#{s.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p>{s.email || "-"}</p>
                        <p className="text-xs text-slate-400">
                          {s.phone || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">{s.course || "N/A"}</td>
                      <td className="px-5 py-4">{s.gender || "-"}</td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            className="rounded-lg bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDropoutStudent(s);
                              setDropoutReason("");
                            }}
                            className="rounded-lg bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600"
                          >
                            Dropout
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(s.id)}
                            className="rounded-lg bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dropoutStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={saveDropout}
            className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-slate-900"
          >
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Dropout Student
            </h2>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <b>Name:</b>{" "}
                {dropoutStudent.full_name ||
                  dropoutStudent.student_name ||
                  dropoutStudent.name ||
                  "No Name"}
              </p>
              <p>
                <b>Email:</b> {dropoutStudent.email || "-"}
              </p>
              <p>
                <b>Course:</b> {dropoutStudent.course || "-"}
              </p>
            </div>

            <textarea
              value={dropoutReason}
              onChange={(e) => setDropoutReason(e.target.value)}
              rows={4}
              placeholder="Enter dropout reason..."
              className="mt-5 w-full resize-none rounded-xl bg-slate-100 p-3 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDropoutStudent(null);
                  setDropoutReason("");
                }}
                className="rounded-lg bg-slate-500 px-4 py-2 text-sm text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700"
              >
                Save Dropout
              </button>
            </div>
          </form>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={saveEdit}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900"
          >
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
              Edit Student Details
            </h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                PROFILE IMAGE
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full rounded-xl bg-slate-100 p-3 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.keys(form).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                    {key.replaceAll("_", " ").toUpperCase()}
                  </label>

                  <input
                    type={key === "dob" ? "date" : "text"}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-100 p-3 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setImageFile(null);
                }}
                className="rounded-lg bg-slate-500 px-4 py-2 text-sm text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}