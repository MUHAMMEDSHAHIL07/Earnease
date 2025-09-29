import React, { useEffect, useState } from "react"
import { Briefcase, MapPin, IndianRupee, Clock, Users, Trash2, Pencil, Lightbulb } from "lucide-react"
import axios from "axios"
import EmployerSidebar from "../Employer/EmployerSidebar"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import GlobalLoader from "../../components/GlobalLoader"

const ViewJob = () => {
  const [jobs, setJob] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const HandleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure to delete job?",
      text: "If yes click on delete button.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/employer/deleteJob/${id}`,
          { withCredentials: true }
        )
        setJob((prev) => prev.filter((job) => job._id !== id))
        Swal.fire({
          icon: "success",
          title: "Deleted Job",
          text: "You have deleted the job.",
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong.",
        })
      }
    }
  }

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employer/getJobs`,
          { withCredentials: true }
        )
        setJob(res.data.getJob)
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <EmployerSidebar sidebarOpen={sidebarOpen} />

      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 mt-10 md:mt-10 text-blue-700 text-center">
            Jobs You've Posted
          </h2>

          {loading ? (
              <GlobalLoader />
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-600 mt-10">
              You haven't posted any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 relative"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Edit Job"
                      onClick={() => navigate(`/employer/editjob/${job._id}`)}
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete Job"
                      onClick={() => HandleDelete(job._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    {job.title}
                  </h3>


                  <p className="text-sm text-gray-600 mb-4">{job.Description}</p>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{job.Location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      <span>{job.Salary}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Lightbulb className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex gap-2 flex-wrap">
                        {job.Skills?.split(",").map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{job.WorkHour}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Gender: {job.Gender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {job.Category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
export default ViewJob