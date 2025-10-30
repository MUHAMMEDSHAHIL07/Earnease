import axios from "axios";
import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import { useEffect,useState } from "react";


const ApplicationStats = () => {
const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0 })
useEffect(()=>{
  const fetchLength = async()=>{
    try{
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/myapplicationstats`, {withCredentials: true,})
    setStats(res.data)
    }
    catch(err){
       console.error("Error fetching appliedjoblength:", err)
    }
  }
  fetchLength()
},[])
  const total = stats.pending + stats.accepted + stats.rejected

  return (
    <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
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