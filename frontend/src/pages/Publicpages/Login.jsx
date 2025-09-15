import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginSchema } from "../../Schema";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";


const RoleSelectModal = ({ onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded shadow-md w-80 text-center">
      <h3 className="text-lg font-semibold mb-4">Continue as</h3>
      <button
        onClick={() => onSelect("student")}
        className="w-full mb-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Student
      </button>
      <button
        onClick={() => onSelect("employer")}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Employer
      </button>
      <p
        onClick={onClose}
        className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline"
      >
        Cancel
      </p>
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleCred, setGoogleCred] = useState(null);

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (vals) => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/login",
          vals,
          { withCredentials: true }
        );
        toast.success("Login successful");
        localStorage.setItem("earneaseUser", JSON.stringify({
          name: data.user.name,
          avatarUrl: data.user.avatarUrl,
        }));

        await fetchUser();

        if (data.role === "student") {
          navigate("/");
        } else if (data.role === "employer") {
          navigate("/employer/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        const status = err.response?.status;
        const role = err.response?.data?.role;
        const empId = err.response?.data?.employerId;
        toast.error(err.response?.data?.message || "Login failed");
        if (status === 401 && role === "employer" && empId) {
          navigate("/verify/employer", { state: { employerId: empId } });
        }
        if (status === 403) {
          navigate("/employer/verification-pending");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleSuccess = async (credResp) => {
    setGLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/googlelogin",
        { credential: credResp.credential },
        { withCredentials: true }
      );

      if (!data.exists) {
        setGoogleCred(credResp.credential);
        return setShowModal(true);
      }

      if (data.blocked) {
        toast.error("Your account is blocked.");
        return;
      }
      await fetchUser();
      
      console.log(data)

      if (data.role === "employer") {
        if (!data.verified) {
          if (data.hasSubmittedVerification) {
            toast.info("You have already submitted verification. Please wait for approval.");
            return navigate("/employer/verification-pending");
          } else {
            toast.info("Please verify your details")
            return navigate("/verify/employer", {
              state: { employerId: data.employerId },
            });
          }
        }
        toast.success("Login successful");
        localStorage.setItem("earneaseUser", JSON.stringify({
          name: data.user.name,
          avatarUrl: data.user.avatarUrl,
        }));
        return navigate("/employer/dashboard");
      }

      toast.success("login succesfull");
      localStorage.setItem("earneaseUser", JSON.stringify({
        name: data.user.name,
        avatarUrl: data.user.avatarUrl
      }))
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const blocked = err.response?.data?.blocked;

      if (status === 403 && blocked) {
        toast.error("Your account is blocked.");
        return;
      }

      console.error("Google login error:", err.response || err);
      toast.error(err.response?.data?.message || err.message || "Google login failed");
    } finally {
      setGLoading(false);
    }
  };

  const finishSignup = async (role) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/googlelogin",
        { credential: googleCred, role },
        { withCredentials: true }
      );

      const { user, employerId } = res.data;

      localStorage.setItem("earneaseUser", JSON.stringify({
        name: user.name,
        avatarUrl: user.avatarUrl,
      }));
      toast.success("Account created ");
      if (role === "employer") {
        return navigate("/verify/employer", {
          state: { employerId }, 
        });
      }

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setShowModal(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-white-100">
      {showModal && (
        <RoleSelectModal
          onSelect={finishSignup}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px] text-center">
        <h2 className="text-3xl font-bold mb-1 text-gray-800">Welcome back </h2>
        <p className="text-gray-500 mb-5">Login to continue your journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="text-left">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 ${loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <Link
            to={"/forgot-password"}
            className="text-blue-500 text-sm mt-2 block text-left"
          >
            Forgot password?
          </Link>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-sm text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="flex justify-center">
            {gLoading ? (
              <p className="text-sm text-gray-500">Loading Google Login...</p>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
              />
            )}
          </div>

          <p className="text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register/student" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
