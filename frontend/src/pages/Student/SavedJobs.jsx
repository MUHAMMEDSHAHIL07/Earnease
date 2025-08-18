import React, { useEffect, useState } from "react";
import { MapPin, IndianRupee, BookmarkX, ExternalLink } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const [getJobs, setGetJobs] = useState([]);
  const handleremove = async(jobId)=>{
     try{
      await axios.delete(`http://localhost:5000/api/student/removeSavedJob/${jobId}`,{withCredentials:true})
        setGetJobs((prevJobs) => prevJobs.filter((saved) => saved.job._id !== jobId))
        toast.success("Job removed from saved")
     }
     catch(err){
        console.log(err)
     }
  }

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/getSavedJob",
          { withCredentials: true }
        );
        setGetJobs(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    fetchSavedJobs()
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"> Saved Jobs</h1>

      {getJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <img
            src="https://illustrations.popsy.co/violet/work-from-home.svg"
            alt="Empty"
            className="w-64 mb-6"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No saved jobs yet
          </h2>
          <p className="text-gray-500">
            Start exploring jobs and save them to apply later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {getJobs.map((saved) => (
            <div
              key={saved._id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
            >
             
              <button className="absolute top-4 right-4 flex items-center text-red-500 hover:text-red-600 text-sm font-medium"
              onClick={()=>handleremove(saved.job._id)}
              >
                <BookmarkX className="w-4 h-4 mr-1" /> Remove
              </button>

              <div className="flex items-center mb-4">
                <img
                  src={saved?.job?.employer?.avatarUrl}
                  alt={saved?.job?.employer?.companyname}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{saved?.job?.title}</h2>
                  <p className="text-sm text-gray-500">
                    {saved?.job?.employer?.companyname}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2" /> {saved?.job?.Location}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <IndianRupee className="w-4 h-4 mr-2" /> {saved?.job?.Salary}
              </div>

              <p className="text-gray-700 mb-4">{saved?.job?.Description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {saved?.job?.Skills?.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                <button className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
                  View Details
                </button>
                <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center">
                  Apply Now <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  )
}
export default SavedJobs