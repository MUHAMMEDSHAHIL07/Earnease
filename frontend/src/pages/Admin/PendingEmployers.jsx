import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


const PendingEmployers = () => {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState({ id: null, action: null })

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/employers/pending`,{withCredentials: true})
      .then((res) => setPending(res.data.pending))
      .catch((err) => console.error("Error fetching:", err))
  }, [])

  const handleAction = (id, action) => {
    setLoading({ id, action })
    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/admin/employers/${action}Employer/${id}`,{},{withCredentials: true})
      .then(() => {
        setPending((prev) => prev.filter((item) => item._id !== id))
        toast.success(`Application ${action === "approve" ? "approved" : "rejected"}`)
      })
      .catch((err) => console.error(err.message))
      .finally(() => setLoading({ id: null, action: null }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Pending Employer Verifications
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length > 0 ? (
                pending.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.employerId?.companyname}
                    </td>
                    <td className="px-4 py-3">{item.employerId?.email}</td>
                    <td className="px-4 py-3">
                      {new Date(item.employerId?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Link
                          to={`/admin/employers/${item._id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleAction(item._id, "approve")}
                          disabled={loading.id === item._id && loading.action === "approve"}
                          className={`px-3 py-1 rounded-md shadow-sm transition ${loading.id === item._id && loading.action === "approve"
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                          {loading.id === item._id && loading.action === "approve"
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleAction(item._id, "reject")}
                          disabled={loading.id === item._id && loading.action === "reject"}
                          className={`px-3 py-1 rounded-md shadow-sm transition ${loading.id === item._id && loading.action === "reject"
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                          {loading.id === item._id && loading.action === "reject"
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No pending employer verifications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PendingEmployers