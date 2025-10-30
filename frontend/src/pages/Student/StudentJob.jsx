import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark,MapPin,Building2,Search,ArrowLeft,Calendar } from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../../components/GlobalLoader";

const JobListUI = () => {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [savedJobs, setSavedJobs] = useState([])
  const [appliedJob, setAppliedJob] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/student/getAllJobs`
        )
        const jobsData = jobsRes.data.jobs
        setJobs(jobsData)
        if (jobsData.length > 0) setSelectedJob(jobsData[0])

        const appliedRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/student/applications`,
          { withCredentials: true }
        )
        const appliedJobId = appliedRes.data.applications.map(
          app => app.job._id
        )
        setAppliedJob(appliedJobId)
      } catch (error) {
        console.log(error)
        toast.error("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const s = searchTerm.toLowerCase()
    return (
      job.title?.toLowerCase().includes(s) ||
      job.Skills?.toLowerCase().includes(s) ||
      job.Location?.toLowerCase().includes(s) ||
      job.Description?.toLowerCase().includes(s) ||
      job.employer?.companyname?.toLowerCase().includes(s)
    )
  })

  const formatDate = isoString => {
    if (!isoString) return "-"
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const applyJob = async id => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student/applyJob/${id}`,
        {},
        { withCredentials: true }
      )
      toast.success("Applied successfully!")
      setAppliedJob(prev => [...prev, id])
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to apply"
      toast.error(msg)
      if (msg.includes("complete your profile")) navigate("/editProfile")
    }
  }

  const saveJob = async jobId => {
    try {
      if (savedJobs.includes(jobId)) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/student/removeSavedJob/${jobId}`,
          { withCredentials: true }
        )
        setSavedJobs(savedJobs.filter(id => id !== jobId))
        toast.success("Removed from saved jobs")
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/student/saveJob`,
          { jobId },
          { withCredentials: true }
        )
        setSavedJobs([...savedJobs, jobId])
        toast.success("Job saved!")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  if (loading)
    return (
      <>
        <Navbar fixed />
        <GlobalLoader />
      </>
    )

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-[80px] min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="sticky top-[80px] z-40 bg-transparent backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, skill, company, or location..."
                className="w-full pl-12 pr-4 py-3.5 text-gray-800 bg-white/70 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 placeholder-gray-400"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-160px)] relative">
          <div
            className={`w-full md:w-[420px] border-r border-gray-200 bg-white/70 overflow-y-auto transition-all duration-300 ${
              showDetail ? "hidden md:block" : "block"
            }`}
          >
            <div className="p-5 space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="text-center mt-32">
                  <p className="text-gray-500 font-medium">No jobs found</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div
                    key={job._id}
                    onClick={() => {
                      setSelectedJob(job)
                      setShowDetail(true)
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedJob?._id === job._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                      {job.employer?.avatarUrl ? (
                        <img
                          src={job.employer.avatarUrl}
                          alt={job.employer.companyname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-700 truncate">
                        {job.employer?.companyname}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {job.Location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className={`${
              showDetail ? "block" : "hidden"
            } md:block flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50/20 transition-all duration-300`}
          >
            {selectedJob ? (
              <div className="w-full flex justify-center p-6 sm:p-8">
                <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 transition-all duration-300 shadow-sm relative">
                  <button
                    onClick={() => setShowDetail(false)}
                    className="absolute top-4 left-4 md:hidden text-gray-600 hover:text-gray-900 transition"
                  >
                    <ArrowLeft size={22} />
                  </button>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 md:mt-0">
                    {selectedJob.title}
                  </h1>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 size={16} />
                      {selectedJob.employer?.companyname}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {selectedJob.Location}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={16} className="text-blue-500" />
                      <span>
                        Posted on{" "}
                        <span className="font-medium text-gray-700">
                          {formatDate(selectedJob.createdAt)}
                        </span>
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                        appliedJob.includes(selectedJob._id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() =>
                        !appliedJob.includes(selectedJob._id) &&
                        applyJob(selectedJob._id)
                      }
                      disabled={appliedJob.includes(selectedJob._id)}
                    >
                      {appliedJob.includes(selectedJob._id)
                        ? "Applied"
                        : "Apply Now"}
                    </button>
                    <button
                      onClick={() => saveJob(selectedJob._id)}
                      className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border transition-all ${
                        savedJobs.includes(selectedJob._id)
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Bookmark
                        size={20}
                        className={
                          savedJobs.includes(selectedJob._id)
                            ? "fill-current"
                            : ""
                        }
                      />
                      {savedJobs.includes(selectedJob._id)
                        ? "Saved"
                        : "Save Job"}
                    </button>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Job Description
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedJob.Description}
                    </p>
                  </div>

                  {selectedJob.Skills && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Required Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.Skills.split(",").map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-200"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default JobListUI