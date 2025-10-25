import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"


const EmployerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/employers/pending/${id}`,{withCredentials: true})
      .then((res) => setData(res.data.verification))
      .catch((err) => console.log(err.message))
  }, [id])

  const handleApprove = () => {
    setLoading("approve")
    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/admin/employers/approveEmployer/${id}`,{withCredentials: true})
      .then(() => {
        toast.success("Employer approved successfully")
        navigate("/admin/employers/pending")
      })
      .catch(() => toast.error("Approval failed"))
      .finally(() => setLoading(null))
  }

  const handleReject = () => {
    setLoading("reject")

    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/admin/employers/rejectEmployer/${id}`, { rejectionReason },{withCredentials: true})
      .then(() => {
        toast.success("Employer rejected successfully")
        navigate("/admin/employers/pending")
      })
      .catch(() => toast.error("Rejection failed"))
      .finally(() => setLoading(null))
  }

  if (!data) return <div className="p-6 text-gray-600">Loading…</div>

  const {
    employerId,
    licenseUrl,
    companyType,
    industry,
    address,
    contactPerson,
    contactEmail,
    websiteUrl,
    aboutCompany,
    foundedYear,
  } = data

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          {employerId.companyname}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <Info label="Email" value={employerId.email} />
            <Info label="Joined On" value={new Date(employerId.createdAt).toLocaleDateString()} />
            <Info label="Company Type" value={companyType} />
            <Info label="Industry" value={industry} />
            <Info label="Address" value={address} />
            <Info label="About company" value={aboutCompany} />
            <Info label="Website" value={websiteUrl} />
            <Info label="Founded year" value={foundedYear} />
            <Info label="Contact Person" value={contactPerson} />
            <Info label="Contact Email" value={contactEmail} />
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Uploaded License</p>
            {licenseUrl ? (
              <a href={licenseUrl} target="_blank" rel="noreferrer">
                <img
                  src={licenseUrl}
                  alt="License"
                  className="w-full max-w-sm rounded-lg border shadow-md transition hover:scale-105 hover:shadow-lg cursor-zoom-in"
                />
              </a>
            ) : (
              <p className="text-red-500 text-sm">No license uploaded.</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-gray-500 opacity-50">(Optional)</span>
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows="3"
            placeholder="Enter reason for rejection..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-start">
          <button
            onClick={handleApprove}
            disabled={loading === "approve"}
            className={`font-semibold px-6 py-2 rounded-lg shadow-md transition ${loading === "approve"
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            {loading === "approve" ? "Approving..." : "Approve"}
          </button>

          <button
            onClick={handleReject}
            disabled={loading === "reject"}
            className={`font-semibold px-6 py-2 rounded-lg shadow-md transition ${loading === "reject"
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            {loading === "reject" ? "Rejecting..." : " Reject"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border border-gray-400 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
             Back
          </button>
        </div>
      </div>
    </div>
  )
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-800">{value || "—"}</p>
  </div>
)

export default EmployerDetail