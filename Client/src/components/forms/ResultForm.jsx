import { useState } from "react";
import api from "../../services/api";

export default function ResultForm() {
  const [form, setForm] = useState({
    student_id: "",
    subject: "",
    marks: "",
    semester: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/results", form);
    alert("Result added");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow max-w-xl space-y-4"
    >
      <input
        className="w-full border p-3 rounded"
        placeholder="Student ID"
        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="Subject"
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="Marks"
        onChange={(e) => setForm({ ...form, marks: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="Semester"
        onChange={(e) => setForm({ ...form, semester: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
        Add Result
      </button>
    </form>
  );
}