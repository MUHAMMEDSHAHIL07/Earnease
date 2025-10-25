import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, TrendingUp, AlertCircle, UserCheck } from 'lucide-react';
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

  const [stats, setStats] = useState({
    totalStudent: 0,
    totalEmployer: 0,
    PendingEmployer: 0,
    PostedJob :0
  })

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`)
      .then(res => setStats(res.data))
      .catch(err => console.log(err.message))
  }, [])

  const StatCard = ({ icon, label, value, trend, gradient }) => (
    <div className={`relative overflow-hidden rounded-xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={14} className={trend > 0 ? '' : 'rotate-180'} />
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  )

  const QuickAction = ({ icon, title, to, color }) => (
    <Link
      to={to}
      className="group flex flex-col items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
    >
      <div className={`${color} p-3 rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700 text-center">{title}</span>
    </Link>
  )

  const AlertCard = ({ count, description, action }) => (
    <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
      <div className="text-amber-600 mr-3">
        <AlertCircle size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">
          <span className="font-bold">{count}</span> {description}
        </p>
      </div>
      <Link to={action.link} className="text-sm font-semibold text-amber-700 hover:text-amber-800">
        {action.text}
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and quick actions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard 
            icon={<UserCheck size={20} />} 
            label="Total Students" 
            value={stats.totalStudent}
            trend={12.5}
            gradient="bg-blue-500"
          />
          <StatCard 
            icon={<Briefcase size={20} />} 
            label="Active Employers"
            value={stats.totalEmployer}
            trend={8.3}
            gradient="bg-purple-500"
          />
          <StatCard 
            icon={<FileText size={20} />} 
            label="Posted Jobs" 
            value={stats.PostedJob}
            trend={5.2}
            gradient="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                <p className="text-sm text-gray-500">Monthly performance</p>
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp size={16} className="mr-1" />
                +12.5%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <AlertCard 
              count={stats.PendingEmployer}
              description="employers awaiting verification"
              action={{ text: "Review", link: "/admin/employers/pending" }}
            />
            
            <div className="bg-white p-5 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Platform Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-gray-800">2,847</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Applications</span>
                  <span className="font-semibold text-gray-800">12,456</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">87.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction 
              icon={<Users size={18} />} 
              title="Students"  
              to="/studentmanagement"
              color="bg-blue-50 text-blue-600"
            />
            <QuickAction 
              icon={<Briefcase size={18} />} 
              title="Employers" 
              to="/employermanagement"
              color="bg-purple-50 text-purple-600"
            />
            <QuickAction 
              icon={<FileText size={18} />} 
              title="Jobs"
              to="/jobs"
              color="bg-green-50 text-green-600"
            />
            <QuickAction 
              icon={<FileText size={18} />} 
              title="Reports"
              to="/reports"
              color="bg-gray-100 text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard