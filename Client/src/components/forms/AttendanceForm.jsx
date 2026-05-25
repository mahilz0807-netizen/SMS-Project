import { useState } from "react";
import api from "../../services/api";

export default function AttendanceForm() {
  const [form, setForm] = useState({
    student_id: "",
    date: "",
    status: "present"
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/attendance", form);
    alert("Attendance marked");
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
        type="date"
        className="w-full border p-3 rounded"
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <select
        className="w-full border p-3 rounded"
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
        Save Attendance
      </button>
    </form>
  );
}