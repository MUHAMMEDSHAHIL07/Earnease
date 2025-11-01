import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

const ChangePassword = () =>{
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student/changepassword`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmNewPassword: form.confirmPassword
        },
        { withCredentials: true } 
      )

      toast.success(res.data.message || "Password changed successfully")
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password"
      toast.error(msg)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { key: "currentPassword", label: "Current Password", show: show.current, toggle: "current" },
          { key: "newPassword", label: "New Password", show: show.new, toggle: "new" },
          { key: "confirmPassword", label: "Confirm New Password", show: show.confirm, toggle: "confirm" }
        ].map(({ key, label, show: visible, toggle }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [toggle]: !visible })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {visible ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}
export default ChangePassword