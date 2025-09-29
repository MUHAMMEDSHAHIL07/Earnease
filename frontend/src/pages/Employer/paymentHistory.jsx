import React, { useEffect, useState } from 'react';
import { Check, Download, Eye, Filter, Search, Calendar, Menu } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';
import GlobalLoader from '../../components/GlobalLoader';

const PaymentHistoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [paymentHistory, setPaymentHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employer/getEmployerPayments`,
          { withCredentials: true }
        );
        const formatted = res.data.map(p => ({
          paymentId: p.paymentId,
          planName: p.description || "N/A",
          amount: `₹${p.amount}`,
          date: new Date(p.createdAt).toLocaleDateString(),
          time: new Date(p.createdAt).toLocaleTimeString(),
          paymentMethod: p.method || "N/A",
          status: p.status === "captured" ? "Completed" : "Pending",
        }));
        setPaymentHistory(formatted);
      } catch (err) {
        console.log(err);
      }
      finally{
        setLoading(false)
      }
    }
    fetchPayment()
  }, [])

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch =
      payment.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === 'all' ||
      payment.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalAmount = paymentHistory
    .filter(p => p.status === 'Completed')
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace('₹', '')), 0)

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    } else if (status === 'Pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Calendar className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
        <EmployerSidebar />
      </div>
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">Manage and view all your payment transactions</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by plan name or payment ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {
            loading ? (
              <GlobalLoader/>
            ):(
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Plan & Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{payment.paymentId}</td>
                      <td className="px-6 py-4">
                        <div>{payment.planName}</div>
                        <div className="font-bold text-green-600">{payment.amount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{payment.date}</div>
                        <div className="text-gray-500">{payment.time}</div>
                      </td>
                      <td className="px-6 py-4">{payment.paymentMethod}</td>
                      <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12 text-gray-500">No payments found</div>
            )}
          </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default PaymentHistoryDashboard