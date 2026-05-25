import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (admin) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await login(form.email, form.password);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-xl shadow-blue-600/30">
            <span className="text-white font-black text-xl">LT</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Little Tech Academy
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Admin Portal — Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder-slate-500 text-sm"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Password
              </label>

              <input
                type="password"
                className="w-full bg-slate-800 border border-slate-700 text-white p-3.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder-slate-500 text-sm"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot Password */}
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer mt-5"
            >
              Forgot Password?
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}