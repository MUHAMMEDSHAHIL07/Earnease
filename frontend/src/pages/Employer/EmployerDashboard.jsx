import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmployerSidebar from "../Employer/EmployerSidebar"

const EmployerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employer, setEmployer] = useState(null);
  const [getemployer,setGetEmployer] = useState("")
  const [application,setApplications] = useState([])
  const [job, setJob] = useState();
  const navigate = useNavigate();
  const [hiredCanidate,setHiredCandiate] = useState([])
  const [montlyPayment,setMontlyPayment] = useState([])


  useEffect(() => {
    const store = localStorage.getItem("earneaseUser");
    if (store) {
      setEmployer(JSON.parse(store));
    }
  }, [])

  useEffect(()=>{
    axios.get("http://localhost:5000/api/employer/candidateHired",{withCredentials:true})
    .then((res)=>setHiredCandiate(res.data))
    .catch(err=>console.log(err))
  })
  useEffect(()=>{
    axios.get("http://localhost:5000/api/employer/montlyPayment",{withCredentials:true})
    .then((res)=>setMontlyPayment(res.data.monthlySpending))
    .catch(err=>console.log(err))
  })

  useEffect(()=>{
    axios.get("http://localhost:5000/api/employer/getprofile",{withCredentials:true})
    .then((res)=>setGetEmployer(res.data.employer))
    .catch(err=>console.log(err))
  },[])
 

  useEffect(() => {
    const JobGet = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employer/getJobs", {
          withCredentials: true,
        });
        setJob(res.data.getJob);
      } catch (error) {
        console.log(error.message);
      }
    };
    JobGet();
  }, []);

  useEffect(()=>{
    axios.get("http://localhost:5000/api/employer/getApplication",{withCredentials:true})
    .then((res)=>setApplications(res.data.message))
    .catch((err)=>console.log(err))
  },[])


  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <EmployerSidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 p-6 md:p-10 mt-4 md:mt-0">
        {employer && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Welcome back, {getemployer.companyname}
              </h2>
              <p className="text-sm text-gray-500">
                Here's what's happening with your jobs today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={employer.avatarUrl}
                alt="avatar"
                className="rounded-full border-2 border-blue-500 w-10 h-10"
              />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                {getemployer.companyname}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Jobs Posted</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">
              {job ? job.length : 0}
            </h3>
            <p className="text-xs text-green-600 mt-1">+3 from last month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Total Applications</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-600">{application?application.length:0}</h3>
            <p className="text-xs text-green-600 mt-1">+18% this week</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Candidates Hired</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">{hiredCanidate.totalHired}</h3>
            <p className="text-xs text-gray-500 mt-1">{hiredCanidate.hiredThisMonth} this month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Monthly Spending</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-600">₹ {montlyPayment}</h3>
            <p className="text-xs text-gray-500 mt-1">All payments up to date</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md w-full sm:w-auto"
            onClick={() => navigate("/employer/post-job")}
          >
            + Post New Job
          </button>
          <button className="bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-6 py-3 rounded-xl font-medium shadow w-full sm:w-auto"
          onClick={()=>navigate("/employer/getApplication")}
          >
            View Applications
          </button>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow mb-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500">
              <tr>
                <th className="py-3">Activity Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3">Application</td>
                <td>New application for Senior Developer position</td>
                <td>Today, 2:30 PM</td>
                <td className="text-blue-600 font-medium">New</td>
              </tr>
              <tr className="border-t">
                <td className="py-3">Hiring</td>
                <td>Offer accepted for Frontend Developer role</td>
                <td>Yesterday</td>
                <td className="text-green-600 font-medium">Completed</td>
              </tr>
              <tr className="border-t">
                <td className="py-3">Job Post</td>
                <td>New job post: UX Designer</td>
                <td>Yesterday</td>
                <td className="text-gray-700 font-medium">Active</td>
              </tr>
              <tr className="border-t">
                <td className="py-3">Payment</td>
                <td>Monthly subscription payment processed</td>
                <td>2 days ago</td>
                <td className="text-green-600 font-medium">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard