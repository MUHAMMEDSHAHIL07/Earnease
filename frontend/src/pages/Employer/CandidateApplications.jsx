import React, { useEffect, useState } from "react"
import { User2, Mail, Briefcase, Clock, MessageSquare } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import EmployerSidebar from "../Employer/EmployerSidebar"
import { useNavigate } from "react-router-dom"
import GlobalLoader from "../../components/GlobalLoader"

const CandidateApplications = () => {
  const [applications, setApplications] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState({ id: null, action: null })
  const [globalLoading, setGlobalLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setGlobalLoading(true)
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/employer/getApplication`, {
        withCredentials: true
      })
      .then((res) => {
        setApplications(res.data.message)
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message
        toast.error(msg)
      })
      .finally(() => setGlobalLoading(false))
  }, [])

  const handleMessage = (chatRoomId) => {
    if (chatRoomId) {
      navigate(`/employer/chat/${chatRoomId}`)
    } else {
      toast.error("Chat room not established yet.")
    }
  }

  const handleCompleteJob = async (app) => {
    try {
      setLoading({ id: app._id, action: "complete" })

      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employer/completeJob/${app._id}`,
        {},
        { withCredentials: true }
      )

      const { orderId, amount } = orderRes.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount,
        currency: "INR",
        name: "Earnease",
        description: `Payment for job: ${app.job.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/employer/verifyjobPayment/${app._id}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            )

            setApplications((prev) =>
              prev.map((a) =>
                a._id === app._id
                  ? { ...a, status: "completed", paymentStatus: "paid" }
                  : a
              )
            )

            toast.success("Payment completed and job marked as completed")
          } catch (err) {
            toast.error("Payment verification failed")
            console.error(err)
          }
        },
        prefill: {
          name: app.student.name,
          email: app.student.email
        },
        theme: {
          color: "#2563EB"
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error("Error initiating payment")
      console.error(err)
    } finally {
      setLoading({ id: null, action: null })
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            My Applications
          </h1>
          <p className="text-gray-500 mt-1">Here are the jobs you have applied to</p>
        </div>

        {globalLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <GlobalLoader />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-sm tracking-wide">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Applied At</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-5 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{app.student?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{app.student?.email}</td>
                      <td className="px-6 py-4 text-gray-700">{app.job?.title}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status?.toLowerCase() === "accepted"
                              ? "bg-green-100 text-green-700"
                              : app.status?.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status?.toLowerCase() === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {app.status?.toLowerCase() === "accepted" && (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleMessage(app.chatRoomId)}
                              className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm shadow-sm transition"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Message
                            </button>

                            {app.paymentStatus !== "paid" ? (
                              <button
                                onClick={() => handleCompleteJob(app)}
                                disabled={loading.id === app._id && loading.action === "complete"}
                                className={`px-3 py-1 rounded-md shadow-sm transition ${
                                  loading.id === app._id && loading.action === "complete"
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {loading.id === app._id && loading.action === "complete"
                                  ? "Processing..."
                                  : "Complete & Pay"}
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-sm font-semibold">
                                Paid
                              </span>
                            )}
                          </div>
                        )}

                        {app.status?.toLowerCase() !== "accepted" && (
                          <span className="text-gray-500 text-sm">
                            {app.status === "pending"
                              ? "Under review"
                              : "No actions available"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default CandidateApplications