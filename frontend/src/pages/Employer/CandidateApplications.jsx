import React, { useEffect, useState } from "react"
import { User2, Mail, Briefcase, Clock, MessageSquare } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import EmployerSidebar from "../Employer/EmployerSidebar"
import { useNavigate } from "react-router-dom"

const CandidateApplications = () => {
  const [applications, setApplications] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
   const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employer/getApplication", {
        withCredentials: true,
      })
      .then((res) => setApplications(res.data.message))
      .catch((err) => {
        const msg = err.response?.data?.message || err.message
        toast.error(msg)
      })
  }, [])

const handleMessage = (chatRoomId) => {
  console.log("handleMessage called with chatRoomId:", chatRoomId); // Log actual value
  if (chatRoomId) {
    navigate(`/employer/chat/${chatRoomId}`);
  } else {
    toast.error("Chat room not established yet.");
  }
};

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            My Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Here are the jobs you have applied to.
          </p>
        </div>

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
                <th className="px-6 py-4 text-center">Message</th>
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
                    <td className="px-6 py-4 text-center">
                      {app.status?.toLowerCase() === "accepted" ? (
                        <button
                          onClick={() => handleMessage(app.chatRoomId)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm shadow-sm transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {app.status === "Pending"
                            ? "Your application is under review."
                            : "No messages available."}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default CandidateApplications