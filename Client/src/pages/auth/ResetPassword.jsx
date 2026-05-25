import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";

export default function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password
        }
      );

      alert("Password changed successfully");

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0">

        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "35px 35px",
          }}
        />
      </div>


      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="relative z-10 w-full max-w-md"
      >

        {/* Header */}

        <div className="text-center mb-8">

          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">

            <Lock
              className="text-white"
              size={28}
            />

          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Reset Password
          </h1>

          <p className="text-slate-400 mt-2">
            Create a new password for your account
          </p>

        </div>


        {/* Card */}

        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          <form
            onSubmit={submit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                New Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-4 top-4 text-slate-500"
                  size={18}
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  py-3.5
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/30
                  "
                />

              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-blue-600
              hover:bg-blue-500
              py-3.5
              rounded-xl
              font-bold
              text-white
              transition
              shadow-lg
              shadow-blue-500/30
              "
            >

              {loading
                ? "Updating..."
                : "Change Password"}

            </button>


            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
              w-full
              border
              border-slate-700
              text-slate-300
              py-3
              rounded-xl
              hover:bg-slate-800
              flex
              items-center
              justify-center
              gap-2
              transition
              "
            >

              <ArrowLeft size={16} />
              Back to Login

            </button>

          </form>

        </div>

      </motion.div>

    </div>

  );

}