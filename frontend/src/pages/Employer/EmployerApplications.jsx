import React, { useEffect, useState } from "react"
import { User2, Mail, Briefcase, Clock } from "lucide-react"
import axios from "axios"
import EmployerSidebar from "../Employer/EmployerSidebar"
import toast from "react-hot-toast"
import GlobalLoader from "../../components/GlobalLoader"
const EmployerApplications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState({ id: null, action: null })
  const [globalLoading, setGlobalLoading] = useState(false)

  useEffect(() => {
    setGlobalLoading(true)
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/employer/getApplication?status=pending`, {
        withCredentials: true,
      })
      .then((res) => {
        setApplications(res.data.message)
        setGlobalLoading(false)
      })
      .catch((err) => console.log(err))
      .finally(() => {
      setGlobalLoading(false);
    });
  }, [])

  const handleAction = (id, action) => {
    setLoading({ id, action })
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/api/employer/${action}Job/${id}`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id
              ? { ...app, status: action === "approve" ? "Accepted" : "Rejected" }
              : app
          )
        )
        toast.success(
          `Application ${action === "approve" ? "approved" : "rejected"}`
        )
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message
        toast.error(msg);
      })
      .finally(() => setLoading({ id: null, action: null }))
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <EmployerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Applications Received
          </h1>
          <p className="text-gray-500 mt-1">
            Here are the latest job applications from students.
          </p>
        </div>
        {
          globalLoading ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <GlobalLoader />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-sm tracking-wide">
                  <tr>
                    <th className="px-6 py-4">
                      <User2 className="inline w-4 h-4 mr-2" />
                      Name
                    </th>
                    <th className="px-6 py-4">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email
                    </th>
                    <th className="px-6 py-4">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      Job Title
                    </th>
                    <th className="px-6 py-4">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Applied At
                    </th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-5 text-center text-gray-500"
                      >
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {app.student?.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {app.student?.email}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {app.job?.title}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${app.status?.toLowerCase() === "accepted"
                                ? "bg-green-100 text-green-700"
                                : app.status?.toLowerCase() === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => handleAction(app._id, "approve")}
                            disabled={
                              loading.id === app._id && loading.action === "approve"
                            }
                            className={`px-3 py-1 rounded-md shadow-sm transition ${loading.id === app._id &&
                                loading.action === "approve"
                                ? "bg-green-300 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                          >
                            {loading.id === app._id &&
                              loading.action === "approve"
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(app._id, "reject")}
                            disabled={
                              loading.id === app._id && loading.action === "reject"
                            }
                            className={`px-3 py-1 rounded-md shadow-sm transition ${loading.id === app._id &&
                                loading.action === "reject"
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                          >
                            {loading.id === app._id &&
                              loading.action === "reject"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        }


      </main>
    </div>
  )
}

export default EmployerApplications
