import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, Settings, HelpCircle, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 50000 },
    { month: 'Mar', revenue: 47000 },
    { month: 'Apr', revenue: 60000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const [stats,setStats] = useState({
    totalStudent:0,totalEmployer:0,PendingEmployer:0
  })

  useEffect(()=>{
    axios.get("http://localhost:5000/admin/dashboard-stats")
    .then(res=>setStats(res.data))
    .catch(err=>console.log(err.message))
  },[])  


  const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
      <div className="flex justify-between items-center">
        <div className="text-2xl">{icon}</div>
      </div>
      <h4 className="text-gray-500 mt-2">{label}</h4>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );

const QuickAction = ({ icon, title, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-center hover:text-blue-600 transition"
  >
    <div className="bg-gray-100 p-3 rounded-full mb-2">{icon}</div>
    <span className="text-sm font-medium">{title}</span>
  </Link>
);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="text-2xl font-semibold mb-6">Admin Dashboard</div>

  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<UserCheck />} label="Total Students" value={stats.totalStudent}  />
        <StatCard icon={<Briefcase />} label="Active Employers"value={stats.totalEmployer} />
        <StatCard icon={<FileText />} label="Posted Jobs" value="3,567" growth="15" />
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="font-semibold mb-2">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Verification Pending</h3>
          <div className="text-4xl font-bold text-red-500">{stats.PendingEmployer}</div>
          <p className="text-sm text-gray-500 mt-1">employer pending verification</p>
          <Link to={"/admin/employers/pending"} className="text-blue-500 text-sm mt-3 inline-block">View Details →</Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction icon={<Users />} title="Manage Students"  to="/studentmanagement" />
        <QuickAction icon={<Briefcase />} title="Manage Employers" to="/employermanagement" />
        <QuickAction icon={<FileText />} title="Job Listings" />
        <QuickAction icon={<FileText />} title="Reports" />
        {/* <QuickAction icon={<Settings />} title="Settings" />
        <QuickAction icon={<HelpCircle />} title="Help Center" /> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
