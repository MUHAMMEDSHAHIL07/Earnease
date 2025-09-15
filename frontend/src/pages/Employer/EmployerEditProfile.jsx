import React, { useEffect, useState } from "react";
import { Upload, Mail, Phone, Globe, Building2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import toast from "react-hot-toast";

const EmployerEditProfile = () => {
  const store = JSON.parse(localStorage.getItem("earneaseUser"))
  const [employer, setEmployer] = useState({})
  const [verification, setVerification] = useState({})
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [form, setForm] = useState({
    companyname: "",
    email: "",
    phone: "",
    websiteUrl: "",
    aboutCompany: "",
    industry: "",
    address: "",
    foundedYear: "",
    avatarUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employer/getprofile", {
        withCredentials: true,
      })
      .then((res) => {
        setEmployer(res.data.employer || {})
        setVerification(res.data.verification || {})
        setForm({
          companyname: res.data.employer?.companyname || "",
          email: res.data.employer?.email || "",
          phone: res.data.employer?.phonenumber || "",
          websiteUrl: res.data.verification?.websiteUrl || "",
          aboutCompany: res.data.verification?.aboutCompany || "",
          industry: res.data.verification?.industry || "",
          address: res.data.verification?.address || "",
          foundedYear: res.data.verification?.foundedYear || "",
          avatarUrl: res.data.employer?.avatarUrl || "",
        });
      })
      .catch(console.error);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "earnease_uploads")

    try {
      await toast
        .promise(
          axios.post(
            "https://api.cloudinary.com/v1_1/dmiqegsx4/upload",
            formData
          ),
          {
            loading: "Uploading image...",
            success: "Image uploaded successfully!",
            error: "Image upload failed",
          }
        )
        .then((res) => {
          const imageUrl = res.data.secure_url;
          setForm((prev) => ({ ...prev, avatarUrl: imageUrl }))
        });
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.patch(
          "http://localhost:5000/api/employer/editprofile",
          form,
          { withCredentials: true }
        ),
        {
          loading: "Saving profile...",
          success: "Profile updated successfully!",
          error: "Error updating profile",
        }
      );

      localStorage.setItem(
        "earneaseUser",
        JSON.stringify({ ...store, avatarUrl: form.avatarUrl })
      );

      navigate("/employer/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployerSidebar sidebarOpen={sidebarOpen} />

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Edit Company Profile
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Update your company information visible to job seekers
          </p>

          <div className="flex items-center gap-6 mb-8">
            <img
              src={form.avatarUrl || store?.avatarUrl}
              alt="Company Logo"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div>
              <input
                type="file"
                id="avatarUpload"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="avatarUpload"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: Square image, at least 400×400px
              </p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name*
              </label>
              <input
                type="text"
                value={form.companyname}
                name="companyname"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                  name="phone"
                  onChange={handleChange}
                  value={form.phone}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  value={form.email}
                  className="w-full pl-10 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="company@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  onChange={handleChange}
                  name="websiteUrl"
                  className="w-full pl-10 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.company.com"
                  value={form.websiteUrl}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Company
              </label>
              <textarea
                rows="4"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your company culture, mission, and values…"
                onChange={handleChange}
                name="aboutCompany"
                value={form.aboutCompany}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Share what makes your company unique and attractive to potential employees
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                rows="4"
                onChange={handleChange}
                name="address"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company address..."
                value={form.address}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={form.industry}
                  name="industry"
                  onChange={handleChange}
                  className="w-full pl-10 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="EG: PVT LTD"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YYYY"
                name="foundedYear"
                onChange={handleChange}
                value={form.foundedYear}
              />
            </div>
          </form>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerEditProfile;