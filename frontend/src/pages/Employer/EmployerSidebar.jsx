import React from "react";
import {Briefcase,Users,CreditCard,LayoutDashboard,MessageSquare,UserCircle,ClipboardList,} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const EmployerSidebar = ({ sidebarOpen }) => {
  const location = useLocation();

  const navItemClass = (path) =>
    `flex items-center gap-3 px-2 py-1 rounded ${location.pathname === path
      ? "text-blue-600 font-semibold bg-blue-50"
      : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <aside
      className={`${sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white p-6 shadow-lg md:rounded-tr-3xl md:rounded-br-3xl z-10 absolute md:static top-16 left-0 md:top-0 md:left-0`}
    >
      <div className="flex items-center justify-start md:justify-start mb-10">
        <img src={logo} alt="logo" className="w-50 h-20" />
      </div>
      <nav className="space-y-4 text-gray-700 font-medium">
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
    </aside>
  );
};

export default EmployerSidebar;
