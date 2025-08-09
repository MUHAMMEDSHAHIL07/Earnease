import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPw] = useState("")
  const [loading, setLoad] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password })
      toast.success("Password updated please login");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password to update your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
