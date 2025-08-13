import { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, FileText, DollarSign, Bookmark, Settings } from "lucide-react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import Navbar from "../../components/Navbar";

const StudentProfile = () => {
  const { user } = useAuth();
  const [job, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/applications",
          { withCredentials: true }
        );
        setJobs(res.data.application || []);
      } catch (err) {
        console.error("Error fetching jobs:", err)
      }
    };
    fetchJobs()
  }, [])

  const statusStyles = {
    accepted:
      "bg-green-100 text-green-700 border border-green-300 font-medium px-3 py-1 rounded-full shadow-sm",
    pending:
      "bg-yellow-100 text-yellow-700 border border-yellow-300 font-medium px-3 py-1 rounded-full shadow-sm",
    rejected:
      "bg-red-100 text-red-700 border border-red-300 font-medium px-3 py-1 rounded-full shadow-sm",
  };

  const Card = ({ children, className }) => (
    <div
      className={`bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );

  const filteredJobs = job.filter((item) => {
    const matchesSearch =
      item?.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.employer?.companyname?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" ? true : item.status === filterStatus
      return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <img
                src={user?.avatarUrl || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <h2 className="mt-4 font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="mt-2 text-gray-600 text-sm">{user?.bio}</p>
              <button className="mt-5 border border-blue-500 text-blue-500 px-5 py-2 rounded-lg w-full hover:bg-blue-500 hover:text-white transition font-medium">
                Edit Profile
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <FileText className="mx-auto text-blue-500 mb-1" />
                <p className="font-bold">24</p>
                <p className="text-xs text-gray-500">Applied</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <CheckCircle className="mx-auto text-green-500 mb-1" />
                <p className="font-bold">3</p>
                <p className="text-xs text-gray-500">Accepted</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <DollarSign className="mx-auto text-purple-500 mb-1" />
                <p className="font-bold">$2,450</p>
                <p className="text-xs text-gray-500">Earnings</p>
              </div>
            </div>
          </Card>

  
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-purple-50">
                <Bookmark size={18} className="text-purple-500" /> Saved Jobs
              </Card>
              <Card className="flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-orange-50">
                <FileText size={18} className="text-orange-500" /> My Applications
              </Card>
              <Card className="flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-100">
                <Settings size={18} className="text-gray-500" /> Settings
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by company or job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

  
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu((prev) => !prev)}
                    className="border px-3 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-100 transition"
                  >
                    <Filter size={16} /> {filterStatus === "all" ? "All Status" : filterStatus}
                  </button>
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
                      {["all", "pending", "accepted", "rejected"].map((status) => (
                        <div
                          key={status}
                          onClick={() => {
                            setFilterStatus(status)
                            setShowFilterMenu(false)
                          }}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 capitalize ${
                            filterStatus === status ? "bg-gray-50 font-medium" : ""
                          }`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3">Job Title</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Applied Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job, idx) => (
                        <tr
                          key={idx}
                          className="text-sm border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3 font-medium">{job?.job?.title}</td>
                          <td className="py-3 flex items-center gap-2">
                            <img
                              src={job?.employer?.avatarUrl}
                              alt="logo"
                              className="w-6 h-6 rounded object-cover"
                            />
                            {job?.employer?.companyname}
                          </td>
                          <td className="py-3">
                            {new Date(job.appliedAt).toISOString().split("T")[0]}
                          </td>
                          <td className="py-3">
                            <span className={statusStyles[job.status]}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-3 text-blue-500 cursor-pointer hover:underline">
                            View Details
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">
                          No matching jobs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
export default StudentProfile