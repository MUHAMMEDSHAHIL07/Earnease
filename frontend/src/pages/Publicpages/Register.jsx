import React, { useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { SignupSchema } from '../../Schema';
import axios from 'axios';
import { toast } from 'react-toastify';
import job from "/src/assets/job.jpg";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('employer') ? 'employer' : 'student';
  const switchTab = (role) => navigate(`/register/${role}`);
  const otpRefs = useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const getOtp = () => otpRefs.current.map((el) => el?.value).join('');


  const initialValues = {
    name: '',
    email: '',
    password: '',
    phonenumber: '',
  };

  const { values, handleBlur, handleChange, errors, } = useFormik({
    initialValues,
    validationSchema: SignupSchema,
    onSubmit: () => { },
  });

  const handleSendOtp = async () => {
    if (!values.email || !values.name || !values.password || !values.phonenumber) {
      toast.error("Please fill all fields before sending OTP");
      return;
    }

    const endpoint =
      activeTab === 'student'
        ? 'http://localhost:5000/api/auth/userregister'
        : 'http://localhost:5000/api/auth/employerregister';

    const payload =
      activeTab === 'student'
        ? {
          name: values.name,
          email: values.email,
          password: values.password,
          phonenumber: values.phonenumber,
        }
        : {
          companyname: values.name,
          email: values.email,
          password: values.password,
          phonenumber: values.phonenumber,
        };

    try {
      setSendingOtp(true);
      const res = await axios.post(endpoint, payload, { withCredentials: true });
      setOtpSent(true);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP sending failed");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    const otp = getOtp();

    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    const endpoint =
      activeTab === 'student'
        ? 'http://localhost:5000/api/auth/userregister'
        : 'http://localhost:5000/api/auth/employerregister';

    const payload =
      activeTab === 'student'
        ? {
          name: values.name,
          email: values.email,
          password: values.password,
          phonenumber: values.phonenumber,
          otp,
        }
        : {
          companyname: values.name,
          email: values.email,
          password: values.password,
          phonenumber: values.phonenumber,
          otp,
        };

    try {
      setVerifyingOtp(true);
      const res = await axios.post(endpoint, payload, { withCredentials: true });
      toast.success("Account created successfully");

      if (activeTab === 'employer') {
        const employerId = res.data.employerId;
        localStorage.setItem("employerId", employerId)
        navigate('/verify/employer', { state: { employerId } });
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.info(err.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleOtpChange = (e, i) => {
    const value = e.target.value;
    if (/^\d$/.test(value) && i < 5) otpRefs.current[i + 1]?.focus();
    if (value === '' && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-pink-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        <div
          className="hidden md:flex md:w-1/2"
          style={{
            background: `url(${job}) center/cover`,
            minHeight: '500px',
          }}
        />
        <div className="p-8 md:p-10 w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-center mb-2">Create your account</h1>

          <div className="flex mb-6 border rounded-full overflow-hidden">
            <button
              onClick={() => switchTab('student')}
              className={`flex-1 py-2 text-sm ${activeTab === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
              Student
            </button>
            <button
              onClick={() => switchTab('employer')}
              className={`flex-1 py-2 text-sm ${activeTab === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
              Employer
            </button>
          </div>
          <div>
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                try {
                  const { data } = await axios.post(
                    "http://localhost:5000/api/auth/googlelogin",
                    { credential, role: activeTab },
                    { withCredentials: true }
                  );
                  toast.success("Login successful");

                  if (data.role === "employer") {
                    localStorage.setItem("employerId", data.employerId);

                    if (data.verified === false) {
                      return navigate("/verify/employer", { state: { employerId: data.employerId } });
                    }


                    return navigate("/employer/dashboard");
                  }

                  navigate("/");

                } catch (err) {
                  toast.error(err?.response?.data?.message || err.message || "Google login failed");
                }
              }}
              onError={() => toast.error("Google login failed")}
            />

            <br />
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={activeTab === 'student' ? 'Full Name' : 'Company Name'}
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={otpSent}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            {otpSent && (
              <div className="flex justify-between gap-1">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e, i)}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="w-10 h-10 border text-center rounded text-lg"
                  />
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Phone Number"
              name="phonenumber"
              value={values.phonenumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.phonenumber && <p className="text-red-500 text-xs">{errors.phonenumber}</p>}

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={verifyingOtp}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                {verifyingOtp ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            )}

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
