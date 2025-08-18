import React, { useEffect, useState } from "react";
import axios from "axios";
import {Bookmark,MapPin,IndianRupee,Building2, Lightbulb, AlignLeft, Search,} from "lucide-react"
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const JobListUI = () => {
  const [jobs, setJobs] = useState([]);
   const [searchTerm, setSearchTerm] = useState("")
   const SearchJOb = jobs.filter((job)=>{
      const search = searchTerm.toLocaleLowerCase()
      return(
      job.title?.toLowerCase().includes(search) ||
      job.Skills?.toLowerCase().includes(search) ||
      job.Location?.toLowerCase().includes(search) ||
      job.Description?.toLowerCase().includes(search) ||
      job.employer?.companyname?.toLowerCase().includes(search)
      )
   })
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/getAllJobs")
        setJobs(res.data.jobs);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchJobs()
    
  }, [])

  const applyJob = async(id)=>{
    try{
      const res = await axios.post(`http://localhost:5000/api/student/applyJob/${id}`,{},{withCredentials: true})
      toast.success("applied job succesfully")
    }
    catch(error){
      const msg = error.response?.data?.message || "Login failed"
      toast.error(msg);
    }
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-10 pb-12 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title, skill, company or location..."
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {SearchJOb.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all relative flex flex-col justify-between"
            >
             
              <Bookmark
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 cursor-pointer"
                title="Save this job"
              />

             
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={job.employer?.avatarUrl || "https://via.placeholder.com/40"}
                  alt="Company Logo"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1 gap-1">
                    <Building2 size={14} /> {job.employer?.companyname || "Company"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-5 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{job.Location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlignLeft size={16} className="text-gray-500" />
                  <span>{job.Description}</span>
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
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-md font-medium transition"
                onClick={()=>applyJob(job._id)}
                >
                  Apply Now
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm py-2.5 rounded-md font-medium transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {SearchJOb.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No job yet
          </p>
        )}
      </div>
    </>
  );
};

export default JobListUI;
