import axios from "axios";
import { useFormik } from "formik";
import {Briefcase,MapPin,IndianRupee,Clock,Users,AlignLeft,ListChecks,} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { JobPostSchema } from "../../Schema";
import { useEffect, useState } from "react";

const PostJob = () => {
  const navigate = useNavigate();
      const [allowed,isAllowed] = useState(null)
    useEffect(()=>{
      const checkLimit = async ()=>{
        try{
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employer/checkpostlimit`,{withCredentials:true})
          if(res.data.canPost){
              isAllowed(true)
          }
          else{
              navigate("/employer/subscription")
          }
        }
        catch(error){
            toast.error(error.response?.data?.message || "Please subscribe to post jobs");
            navigate("/employer/subscription")
        }
      }
      checkLimit()
    },[])
  const formik = useFormik({
    initialValues: {
      title: "",
      Description: "",
      Location: "",
      Salary: "",
      Category: "",
      Skills:"",
      WorkHour: "",
      Gender: "",
    },
    validationSchema: JobPostSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/employer/jobPost`,
          values,
          { withCredentials: true }
        );
        if (res.status === 201) {
          toast.success("Job created successfully");
          resetForm();
          navigate("/employer/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Job post failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Post a New Job
        </h2>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Job Title
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Briefcase className="text-gray-400 mr-2" />
              <input
                type="text"
                name="title"
                placeholder="Enter job title"
                className="w-full outline-none"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Job Description
            </label>
            <div className="flex items-start border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <AlignLeft className="text-gray-400 mr-2 mt-1" />
              <textarea
                name="Description"
                placeholder="Write a short description..."
                className="w-full outline-none h-28 resize-none"
                value={formik.values.Description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.Description && formik.errors.Description && (
              <p className="text-red-500 text-sm">{formik.errors.Description}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <MapPin className="text-gray-400 mr-2" />
              <input
                type="text"
                name="Location"
                placeholder="e.g., Kochi, Kerala"
                className="w-full outline-none"
                value={formik.values.Location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.Location && formik.errors.Location && (
              <p className="text-red-500 text-sm">{formik.errors.Location}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Salary (in ₹)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <IndianRupee className="text-gray-400 mr-2" />
              <input
                type="number"
                name="Salary"
                placeholder="e.g., 5000"
                className="w-full outline-none"
                value={formik.values.Salary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.Salary && formik.errors.Salary && (
              <p className="text-red-500 text-sm">{formik.errors.Salary}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Category
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <ListChecks className="text-gray-400 mr-2" />
              <input
                type="text"
                name="Category"
                placeholder="eg:-Excel,Word e.t.c"
                className="w-full outline-none"
                value={formik.values.Category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.Category && formik.errors.Category && (
              <p className="text-red-500 text-sm">{formik.errors.Category}</p>
            )}
          </div>

          {/* Skills */}
           <div>
            <label className="block font-medium mb-2 text-gray-700">
              Skills
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <ListChecks className="text-gray-400 mr-2" />
              <input
                type="text"
                name="Skills"
                placeholder="e.g., Delivery, Retail"
                className="w-full outline-none"
                value={formik.values.Skills}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Separate each skill with a comma and a space (e.g., <span className="italic">HTML, CSS, JavaScript</span>).
            </p>
            {formik.touched.Skills && formik.errors.Skills && (
              <p className="text-red-500 text-sm">{formik.errors.Skills}</p>
            )}
          </div>

          {/* Work Hours */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Work Hours / Timings
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Clock className="text-gray-400 mr-2" />
              <input
                type="text"
                name="WorkHour"
                placeholder="e.g., 6 PM - 10 PM"
                className="w-full outline-none"
                value={formik.values.WorkHour}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.WorkHour && formik.errors.WorkHour && (
              <p className="text-red-500 text-sm">{formik.errors.WorkHour}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Gender Preference
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Users className="text-gray-400 mr-2" />
              <select
                name="Gender"
                className="w-full outline-none bg-white"
                value={formik.values.Gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select</option>
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {formik.touched.Gender && formik.errors.Gender && (
              <p className="text-red-500 text-sm">{formik.errors.Gender}</p>
            )}
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

export default PostJob