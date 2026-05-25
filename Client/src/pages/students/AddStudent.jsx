import { useEffect, useState } from "react";
import api from "../../services/api";

const API_URL = "http://localhost:5000";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  nic: "",
  occupation: "",
  course: "",
  course_type: "",
  admission_date: "",
  qualification: "",

  permanent_address: "",
  current_address: "",
  district: "",
  home_phone: "",

  father_name: "",
  mother_name: "",
  father_phone: "",
  mother_phone: "",
  father_occupation: "",
  mother_occupation: "",
  monthly_income: "",

  guardian_name: "",
  guardian_relation: "",
  guardian_phone: "",
  guardian_address: "",

  school_name: "",
  education_year: "",
  exam_results: "",
  other_qualifications: "",

  agree_discontinue_fee: false,
};

export default function AddStudent({
  onSuccess,
  editingStudent = null,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editingStudent?.id);

  const loadCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      setForm({
        ...initialForm,
        ...editingStudent,
        full_name: editingStudent.full_name || editingStudent.student_name || "",
        agree_discontinue_fee:
          editingStudent.agree_discontinue_fee === true ||
          editingStudent.agree_discontinue_fee === "true",
      });

      if (editingStudent.image) {
        setImagePreview(`${API_URL}${editingStudent.image}`);
      } else if (editingStudent.image_url) {
        setImagePreview(editingStudent.image_url);
      } else {
        setImagePreview(null);
      }

      setImage(null);
    } else {
      setForm(initialForm);
      setImage(null);
      setImagePreview(null);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setImagePreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value ?? "");
      });

      if (image) {
        fd.append("image", image);
      }

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        await api.put(`/students/${editingStudent.id}`, fd, config);
        alert("Student updated successfully");
        onCancelEdit?.();
      } else {
        await api.post("/students", fd, config);
        alert("Student added successfully. Email sent to student.");
        resetForm();
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-blue-950/40 md:p-8"
    >
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              Admission Portal
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {isEdit ? "Edit Student Admission" : "Student Admission Form"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Please enter accurate student, course, parent and guardian information.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-300">
            {isEdit ? "Update Mode" : "New Admission"}
          </div>
        </div>

        <Section title="Personal Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
            <Field label="NIC / ID Number" name="nic" value={form.nic} onChange={handleChange} required={false} />
            <Field label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} required={false} />

            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />
          </div>
        </Section>

        <Section title="Contact Information">
          <div className="grid gap-5 md:grid-cols-2">
            <TextAreaField label="Permanent Address" name="permanent_address" value={form.permanent_address} onChange={handleChange} />
            <TextAreaField label="Current Address" name="current_address" value={form.current_address} onChange={handleChange} />
            <Field label="District" name="district" value={form.district} onChange={handleChange} />
            <Field label="Home Phone Number" name="home_phone" value={form.home_phone} onChange={handleChange} required={false} />
          </div>
        </Section>

        <Section title="Course Information">
          <div className="grid gap-5 md:grid-cols-2">
            <CourseSelectField
              label="Selected Course"
              name="course"
              value={form.course}
              onChange={handleChange}
              courses={courses}
            />

            <SelectField
              label="Course Type"
              name="course_type"
              value={form.course_type}
              onChange={handleChange}
              options={["Full Time", "Part Time"]}
            />

            <Field label="Admission Date" name="admission_date" type="date" value={form.admission_date} onChange={handleChange} />
            <Field label="Educational Qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="Example: O/L, A/L, Diploma" />
          </div>
        </Section>

        <Section title="Student Photo">
          <div className="flex flex-col gap-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-5 md:flex-row md:items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Student"
                className="h-28 w-28 rounded-2xl border-2 border-blue-500 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 text-xs font-bold text-slate-500">
                PHOTO
              </div>
            )}

            <label className="flex-1 cursor-pointer rounded-2xl bg-slate-800 p-5 text-center transition hover:bg-slate-700">
              <p className="font-bold text-white">
                {isEdit ? "Change Student Photo" : "Upload Student Photo"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                PNG, JPG or JPEG up to 5MB
              </p>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>
        </Section>

        <Section title="Parents Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Father Name" name="father_name" value={form.father_name} onChange={handleChange} />
            <Field label="Mother Name" name="mother_name" value={form.mother_name} onChange={handleChange} />
            <Field label="Father Phone" name="father_phone" value={form.father_phone} onChange={handleChange} />
            <Field label="Mother Phone" name="mother_phone" value={form.mother_phone} onChange={handleChange} />
            <Field label="Father Occupation" name="father_occupation" value={form.father_occupation} onChange={handleChange} required={false} />
            <Field label="Mother Occupation" name="mother_occupation" value={form.mother_occupation} onChange={handleChange} required={false} />
            <Field label="Monthly Family Income" name="monthly_income" type="number" value={form.monthly_income} onChange={handleChange} required={false} />
          </div>
        </Section>

        <Section title="Guardian Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Guardian Name" name="guardian_name" value={form.guardian_name} onChange={handleChange} />

            <SelectField
              label="Guardian Relationship"
              name="guardian_relation"
              value={form.guardian_relation}
              onChange={handleChange}
              options={["Father", "Mother", "Guardian", "Brother", "Sister", "Uncle", "Aunt", "Other"]}
            />

            <Field label="Guardian Phone" name="guardian_phone" value={form.guardian_phone} onChange={handleChange} />
          </div>

          <div className="mt-5">
            <TextAreaField label="Guardian Address" name="guardian_address" value={form.guardian_address} onChange={handleChange} />
          </div>
        </Section>

        <Section title="Academic Qualifications">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="School Name" name="school_name" value={form.school_name} onChange={handleChange} />
            <Field label="Education Year" name="education_year" value={form.education_year} onChange={handleChange} />
          </div>

          <div className="mt-5 space-y-5">
            <TextAreaField label="Exam Results" name="exam_results" value={form.exam_results} onChange={handleChange} />
            <TextAreaField label="Other Qualifications" name="other_qualifications" value={form.other_qualifications} onChange={handleChange} required={false} />
          </div>
        </Section>

        <div className="flex flex-col gap-4 border-t border-slate-800 pt-6 md:flex-row">
          {isEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl bg-slate-800 px-8 py-4 font-bold text-white transition hover:bg-slate-700"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-900/40 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}

            {loading
              ? "Saving Admission..."
              : isEdit
              ? "Update Admission"
              : "Submit Admission"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="mb-5 border-b border-slate-800 pb-3 text-lg font-black text-white">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function CourseSelectField({ label, name, value, onChange, courses }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="">
          {courses.length === 0 ? "No courses available" : "Select Course"}
        </option>

        {courses.map((course) => (
          <option key={course.id} value={course.title}>
            {course.title} {course.code ? `- ${course.code}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = true }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="">Select {label}</option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, required = true }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        rows={3}
        className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}