import { useEffect, useState } from "react";
import { Search, Trash2, AlertTriangle, UserX } from "lucide-react";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";

const API_URL = "http://localhost:5000";

export default function DropoutStudents() {
  const [dropouts, setDropouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadDropouts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dropout");

      setDropouts(res.data?.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load dropout students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropouts();
  }, []);

  const removeDropout = async (id) => {
    if (!window.confirm("Delete this dropout record?")) return;

    try {
      await api.delete(`/dropout/${id}`);
      setDropouts((prev) => prev.filter((d) => d.id !== id));
      alert("Dropout record deleted");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const getImageSrc = (d) => {
    const img =
      d.image ||
      d.image_url ||
      d.photo ||
      d.photo_url ||
      d.imageUrl ||
      "";

    if (!img) return null;
    if (img.startsWith("http")) return img;

    return `${API_URL}${img.startsWith("/") ? img : "/" + img}`;
  };

  const filteredDropouts = dropouts.filter((d) => {
    const keyword = search.toLowerCase();

    return (
      d.full_name?.toLowerCase().includes(keyword) ||
      d.email?.toLowerCase().includes(keyword) ||
      d.course?.toLowerCase().includes(keyword) ||
      d.reason?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <UserX size={30} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/80">
                Student Records
              </p>

              <h1 className="mt-1 text-3xl font-black text-white">
                Dropout Students
              </h1>

              <p className="mt-1 text-sm text-white/80">
                View and manage students marked as dropout.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center">
            <p className="text-xs font-bold uppercase text-white/70">
              Total Dropouts
            </p>
            <p className="text-3xl font-black text-white">
              {filteredDropouts.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name, email, course or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-5 text-left">#</th>
                <th className="px-6 py-5 text-left">Image</th>
                <th className="px-6 py-5 text-left">Student</th>
                <th className="px-6 py-5 text-left">Email</th>
                <th className="px-6 py-5 text-left">Course</th>
                <th className="px-6 py-5 text-left">Reason</th>
                <th className="px-6 py-5 text-left">Date</th>
                <th className="px-6 py-5 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDropouts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <AlertTriangle
                      size={34}
                      className="mx-auto mb-3 text-sky-600"
                    />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      No dropout students found
                    </h3>
                    <p className="text-sm text-slate-500">
                      Dropout records will appear here after saving.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDropouts.map((d, index) => {
                  const imageSrc = getImageSrc(d);

                  return (
                    <tr
                      key={d.id}
                      className="border-t border-slate-100 text-slate-700 hover:bg-sky-50/60 dark:border-slate-800 dark:text-slate-300"
                    >
                      <td className="px-6 py-5 text-sm font-bold">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={d.full_name || "Student"}
                            className="h-14 w-14 rounded-2xl border-2 border-sky-500 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white">
                            {d.full_name?.[0]?.toUpperCase() || "S"}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-black text-slate-900 dark:text-white">
                          {d.full_name || "-"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Student ID: {d.student_id || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm">{d.email || "-"}</td>

                      <td className="px-6 py-5">{d.course || "-"}</td>

                      <td className="px-6 py-5">{d.reason || "-"}</td>

                      <td className="px-6 py-5 text-sm">
                        {d.created_at
                          ? new Date(d.created_at).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => removeDropout(d.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                          <Trash2 size={15} />
                          Delete
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
  );
}