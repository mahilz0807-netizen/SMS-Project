import { useState } from "react";
import api from "../../services/api";

export default function CourseForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    code: "",
    semester: "",
    description: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/courses", form);

    setForm({
      title: "",
      code: "",
      semester: "",
      description: ""
    });

    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow grid md:grid-cols-4 gap-4"
    >
      <input
        className="border p-3 rounded"
        placeholder="Course Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Course Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Semester"
        value={form.semester}
        onChange={(e) => setForm({ ...form, semester: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button className="bg-blue-600 text-white py-3 rounded-xl">
        Add Course
      </button>
    </form>
  );
}