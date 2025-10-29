import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

const sampleApplications = [
  {
    id: 1,
    jobTitle: 'Content Writer Intern',
    company: 'TechStart Media',
    location: 'Remote',
    salary: '₹8,000 - ₹12,000/month',
    status: 'Approved',
    appliedDate: '2024-10-15',
    progress: 'approved'
  },
  {
    id: 2,
    jobTitle: 'Social Media Manager',
    company: 'Bright Ideas Co.',
    location: 'Mumbai, Maharashtra',
    salary: '₹10,000/month',
    status: 'Pending',
    appliedDate: '2024-10-20',
    progress: 'reviewed'
  },
  {
    id: 3,
    jobTitle: 'Graphic Designer',
    company: 'Creative Studio',
    location: 'Bangalore, Karnataka',
    salary: '₹15,000 - ₹18,000/month',
    status: 'Rejected',
    appliedDate: '2024-10-10',
    progress: 'rejected'
  },
  {
    id: 4,
    jobTitle: 'Data Entry Operator',
    company: 'InfoTech Solutions',
    location: 'Delhi NCR',
    salary: '₹6,000/month',
    status: 'Pending',
    appliedDate: '2024-10-25',
    progress: 'applied'
  },
  {
    id: 5,
    jobTitle: 'Customer Support Associate',
    company: 'QuickServe Inc.',
    location: 'Pune, Maharashtra',
    salary: '₹9,000/month',
    status: 'Approved',
    appliedDate: '2024-10-18',
    progress: 'approved'
  },
  {
    id: 6,
    jobTitle: 'Marketing Intern',
    company: 'Growth Hackers',
    location: 'Remote',
    salary: '₹5,000 - ₹8,000/month',
    status: 'Pending',
    appliedDate: '2024-10-22',
    progress: 'applied'
  }
]

const ApplicationStats = () => {
      const [applications] = useState(sampleApplications)
        const stats = useMemo(() => {
          return {
            total: applications.length,
            pending: applications.filter(app => app.status === 'Pending').length,
            approved: applications.filter(app => app.status === 'Approved').length,
            rejected: applications.filter(app => app.status === 'Rejected').length
          };
        }, [applications]);
  return (
    <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-3 rounded-lg">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ApplicationStats