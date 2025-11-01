import React, { useEffect, useState } from "react"
import axios from "axios"
import { Eye, Download } from "lucide-react"
import toast from "react-hot-toast"

export default function PaymentsEarnings() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/student/payments`,
          { withCredentials: true }
        )
        setPayments(res.data.payments || [])
      } catch (err) {
        toast.error("Failed to load payments")
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading payments...
      </div>
    )

  return (
     <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Payments & Earnings
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700 text-base">
          Total Earnings:{" "}
          <span className="font-bold text-green-600 text-lg">₹{total}</span>
        </p>
        <p className="text-sm text-gray-500">
          {payments.length} {payments.length === 1 ? "payment" : "payments"} received
        </p>
      </div>

      <div className="space-y-4 max-h-[26rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1">
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-8 italic">
            No payments received yet.
          </p>
        ) : (
          payments.map((p) => (
            <div
              key={p._id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md hover:bg-white transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 text-lg">
                    {p.job?.title || "Unknown Job"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {p.employer?.email || "Unknown Employer"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.paymentReceivedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    title="View details"
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    title="Download receipt"
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-2xl font-bold text-green-600">₹{p.amount}</p>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.method} • {p.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      </>

  )
}
