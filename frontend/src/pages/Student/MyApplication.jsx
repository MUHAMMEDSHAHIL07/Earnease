import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MapPin, Briefcase, Calendar, Eye } from "lucide-react"
import ApplicationStats from "./ApplicationStats"
import axios from "axios"

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
}

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const statusMap = {
        All: "all",
        Pending: "pending",
        Approved: "accepted",
        Rejected: "rejected",
    };

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const status = statusMap[filter]
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/student/myapplications?page=${page}&limit=15&search=${search}&status=${status}`,
                { withCredentials: true }
            )
            setApplications(res.data.applications)
            setTotalPages(res.data.totalPages)
            setTotalCount(res.data.totalCount)
        } catch (error) {
            console.error("Error fetching applications:", error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchApplications()
    }, [page, search, filter])

    const getPageNumbers = () => {
        const delta = 2
        const range = []
        for (
            let i = Math.max(1, page - delta);
            i <= Math.min(totalPages, page + delta);
            i++
        ) {
            range.push(i)
        }
        return range
    }
    const formatDate = (isoString) => {
        if (!isoString) return "N/A"
        const date = new Date(isoString)
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Applications
                </h1>
                <p className="text-gray-600 mt-2">
                    Track your job applications and stay updated with your status
                </p>
            </motion.div>

            <ApplicationStats />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>

                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200">
                    <Filter className="text-blue-600" size={18} />
                    <select
                        className="bg-transparent text-gray-800 font-medium outline-none focus:ring-0 cursor-pointer"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value)
                            setPage(1)
                        }}
                    >
                        <option>All</option>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
                    </select>
                </div>

            </div>

            {loading ? (
                <div className="text-center text-gray-600 mt-20">Loading...</div>
            ) : applications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center mt-20"
                >
                    <img
                        src="https://illustrations.popsy.co/gray/work-from-home.svg"
                        alt="No applications"
                        className="w-60"
                    />
                    <h3 className="text-gray-700 font-semibold mt-4 text-lg">
                        No applications found
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Start exploring jobs and apply to get listed here
                    </p>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {applications.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {app.job?.title}
                                    </h2>
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[app.status] || "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                                    <Briefcase size={16} /> {app.employer?.companyname}
                                </p>
                                <p className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                                    <MapPin size={16} /> {app.job?.Location}
                                </p>
                                <p className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                                    ₹{app.job?.Salary}
                                </p>
                                <p className="text-gray-500 flex items-center gap-2 text-xs mt-2">
                                    <Calendar size={14} /> Applied on {formatDate(app.appliedAt)}
                                </p>

                                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-all">
                                    <Eye size={16} /> View Details
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {totalCount > 15 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full font-medium ${num === page
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default MyApplications