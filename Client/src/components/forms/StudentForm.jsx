import { useState } from "react";
import api from "../../services/api";

export default function StudentForm({ onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    course: ""
  });

  const [image, setImage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("full_name", form.full_name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("course", form.course);

    if (image) {
      fd.append("image", image);
    }

    await api.post("/students", fd);

    setForm({
      full_name: "",
      email: "",
      phone: "",
      course: ""
    });

    setImage(null);

    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow grid md:grid-cols-5 gap-4"
    >
      <input
        className="border p-3 rounded"
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="border p-3 rounded"
        placeholder="Course"
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="bg-blue-600 text-white py-3 rounded-xl">
        Add Student
      </button>
    </form>
  );
}