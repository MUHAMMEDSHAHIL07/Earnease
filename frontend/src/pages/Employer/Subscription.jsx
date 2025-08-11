import axios from "axios";
import {useNavigate} from "react-router-dom"
const Subscription = () => {
  const navigate = useNavigate()
  const handlePayment = async (subscriptionType, amount) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/employer/paymentJob",
      { subscriptionType, amount },
      { withCredentials: true }
    );
    
    const  order  = data;
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount,
      currency: "INR",
      name: "Earnease",
      description: `${subscriptionType} Plan Subscription`,
      order_id: order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:5000/api/employer/verifypayment",
          {
            ...response,
            subscriptionType
          },
          { withCredentials: true }
        );
        toast.succes("payment succesfull")
        navigate("/employer/post-job")
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp1 = new window.Razorpay(options)
    rzp1.open()
  } catch (error) {
    console.error(error)
  }
};

  return (
<div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-br">
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
      Choose Your Plan
    </h1>
    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
      Select the perfect plan that fits your needs. Upgrade or downgrade at
      any time with no hidden fees.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

    <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-transparent flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Single</h2>
        <div className="flex items-baseline mb-6">
          <span className="text-lg font-semibold text-slate-500">₹</span>
          <span className="text-5xl font-extrabold text-slate-900">99</span>
          <span className="text-sm text-slate-500 ml-2">/ month</span>
        </div>
        <ul className="mb-6 space-y-3">
          {[
            "Up to 5 job postings",
            "Basic analytics dashboard",
            "Email support",
            "Standard listing visibility",
          ].map((feature, i) => (
            <li key={i} className="flex items-center text-slate-600">
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xs font-bold mr-3">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-auto w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all"
        onClick={() => handlePayment("single", 99)}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500"></span>
        Choose Plan
      </button>
    </div>


    <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-transparent flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Monthly</h2>
        <div className="flex items-baseline mb-6">
          <span className="text-lg font-semibold text-slate-500">₹</span>
          <span className="text-5xl font-extrabold text-slate-900">249</span>
          <span className="text-sm text-slate-500 ml-2">/ month</span>
        </div>
        <ul className="mb-6 space-y-3">
          {[
            "Up to 25 job postings",
            "Advanced analytics & insights",
            "Priority email & chat support",
            "Enhanced listing visibility",
          ].map((feature, i) => (
            <li key={i} className="flex items-center text-slate-600">
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xs font-bold mr-3">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-auto w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all"
        onClick={() => handlePayment("monthly", 249)}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500"></span>
        Choose Plan
      </button>
    </div>

    <div className="relative bg-white rounded-2xl p-8 shadow-md border-2 border-blue-500 flex flex-col h-full">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-500 to-blue-800 text-white px-4 py-1 rounded-lg text-sm font-semibold shadow">
        Most Popular
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 mt-4">Yearly</h2>
        <div className="flex items-baseline mb-6">
          <span className="text-lg font-semibold text-slate-500">₹</span>
          <span className="text-5xl font-extrabold text-slate-900">700</span>
          <span className="text-sm text-slate-500 ml-2">/ month</span>
        </div>
        <ul className="mb-6 space-y-3">
          {[
            "Unlimited job postings",
            "Full analytics suite & reports",
            "24/7 priority support",
            "Premium listing + featured spots",
          ].map((feature, i) => (
            <li key={i} className="flex items-center text-slate-600">
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xs font-bold mr-3">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-auto w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all"
        onClick={() => handlePayment("yearly", 700)}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500"></span>
        Choose Plan
      </button>
    </div>
  </div>
</div>

  );
};

export default Subscription