import axios from "axios";
import {Briefcase,MapPin,IndianRupee,Clock,Users,AlignLeft,ListChecks,} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostJob = () => {
    const [form,setForm] = useState({
    title:"",
    Description:"",
    Location:"",
    Salary:"",
    Category:"",
    WorkHour:"",
    Gender:""
    })
    const navigate = useNavigate()
    const handleChange =(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res= await axios.post("http://localhost:5000/api/employer/jobPost",form,{withCredentials: true})
            if(res.status===201){
                toast.success("job created succesufully")
                navigate("/employer/dashboard")
            }
        }
        catch(error){
             console.error(error);
             toast.error(error.response?.data?.message || "Job post failed");
        }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Post a New Job
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
         
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Job Title
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Briefcase className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter job title"
                name="title"
                className="w-full outline-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

   
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Job Description
            </label>
            <div className="flex items-start border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <AlignLeft className="text-gray-400 mr-2 mt-1" />
              <textarea
                placeholder="Write a short description..."
                className="w-full outline-none h-28 resize-none"
                required
                onChange={handleChange}
                name="Description"
              />
            </div>
          </div>

    
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <MapPin className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="e.g., Kochi, Kerala"
                className="w-full outline-none"
                required
                onChange={handleChange}
                name="Location"
              />
            </div>
          </div>


          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Salary (in ₹)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <IndianRupee className="text-gray-400 mr-2" />
              <input
                type="number"
                placeholder="e.g., 5000"
                required
                onChange={handleChange}
                name="Salary"
                className="w-full outline-none"
              />
            </div>
          </div>

  
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Category
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <ListChecks className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="e.g., Delivery, Retail"
                required
                onChange={handleChange}
                name="Category"
                className="w-full outline-none"
              />
            </div>
          </div>

      
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Work Hours / Timings
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Clock className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="e.g., 6 PM - 10 PM"
                required
                onChange={handleChange}
                name="WorkHour"
                className="w-full outline-none"
              />
            </div>
          </div>

      
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Gender Preference
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Users className="text-gray-400 mr-2" />
              <select className="w-full outline-none bg-white" required onChange={handleChange} name="Gender">
                <option value="">Select</option>
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
