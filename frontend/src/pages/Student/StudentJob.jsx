import React, { useEffect, useState } from "react";
import axios from "axios";
import {Bookmark,MapPin,IndianRupee,Building2,} from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const JobListUI = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/student/getAllJobs");
        setJobs(res.data.jobs);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchJobs();
    
  }, []);

  const applyJob = async(id)=>{
    try{
      const res = await axios.post(`http://localhost:5000/student/applyJob/${id}`,{},{withCredentials: true})
      toast.success("applied job succesfully")
    }
    catch(error){
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-24 pb-12 px-4 sm:px-8">

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {jobs.map((job) => (
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
                  <IndianRupee size={16} className="text-gray-500" />
                  <span>{job.Salary}</span>
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

        {jobs.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No job yet
          </p>
        )}
      </div>
    </>
  );
};

export default JobListUI;
