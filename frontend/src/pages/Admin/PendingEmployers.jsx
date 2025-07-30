import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PendingEmployers = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/employers/pending")
      .then((res) => setPending(res.data.pending))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const handleApprove = (id) => {
    axios
      .patch(`http://localhost:5000/admin/employers/approveEmployer/${id}`)
      .then(() => {
        setPending((prev) => prev.filter((item) => item._id !== id));
        toast.success("Application approved");
      })
      .catch((err) => console.error("Approval failed:", err.message));
  };

  const handleReject = (id) => {
    axios
      .patch(`http://localhost:5000/admin/employers/rejectEmployer/${id}`)
      .then(() => {
        setPending((prev) => prev.filter((item) => item._id !== id));
        toast.success("Application rejected");
      })
      .catch((err) => console.error("Rejection failed:", err.message));
  };

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
                      {item.employerId.companyname}
                    </td>
                    <td className="px-4 py-3">{item.employerId.email}</td>
                    <td className="px-4 py-3">
                      {new Date(item.employerId.createdAt).toLocaleDateString()}
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
                          onClick={() => handleApprove(item._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow-sm transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No pending employer verifications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingEmployers;
