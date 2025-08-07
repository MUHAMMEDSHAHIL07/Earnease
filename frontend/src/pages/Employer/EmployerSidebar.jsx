import React, { useState } from "react";
import {Briefcase,Users,CreditCard,LayoutDashboard,MessageSquare,UserCircle,ClipboardList,LogOut,Menu,X,} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"
import logo from "../../assets/logo.png"

const EmployerSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItemClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
      location.pathname === path
        ? "text-blue-600 font-semibold bg-blue-100"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
    }`;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("http://localhost:5000/api/auth/logout", {
          withCredentials: true,
        });
        localStorage.removeItem("earneaseUser");
        navigate("/login");
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been successfully logged out.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while logging out.",
        });
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md"
      >
        <Menu size={24} />
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-[900ms] ease-in-out flex flex-col justify-between 
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none md:flex h-[100vh]`}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center md:hidden mb-4">
            <img src={logo} alt="Logo" className="w-32" />
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="hidden md:flex justify-start mb-10">
            <img src={logo} alt="logo" className="w-40 h-14 object-contain" />
          </div>

          {/* Navigation */}
          <nav className="space-y-2 text-gray-700 font-medium">
            <Link to="/employer/dashboard" className={navItemClass("/employer/dashboard")}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/viewJob" className={navItemClass("/viewJob")}>
              <Briefcase size={20} /> Jobs Posted
            </Link>
            <Link to="/employer/getApplication" className={navItemClass("/employer/getApplication")}>
              <ClipboardList size={20} /> Applications
            </Link>
            <div className={navItemClass("/candidates")}>
              <Users size={20} /> Candidates
            </div>
            <Link to="/employer/editProfile" className={navItemClass("/employer/editProfile")}>
              <UserCircle size={20} /> Profile
            </Link>
            <div className={navItemClass("/payments")}>
              <CreditCard size={20} /> Payments
            </div>
            <div className={navItemClass("/support")}>
              <MessageSquare size={20} /> Support
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 transition-all duration-200 rounded-lg font-medium group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default EmployerSidebar