import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("earneaseUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/auth/logout", { withCredentials: true });
      localStorage.removeItem("earneaseUser");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Earnease Logo" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-semibold"
            >
              Home
            </Link>
            <Link
              to="/job"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-semibold"
            >
              Find Jobs
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-semibold"
            >
              How It Works
            </Link>
             <Link
              to="/aboutus"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-semibold"
            >
              About Us
            </Link>

            {user ? (
              <div className="relative group">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover transition-transform duration-200 hover:scale-110"
                  />
                )}
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95 z-20">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-blue-800 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Login
                </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed top-16 right-0 w-4/5 max-w-sm bg-white/95 backdrop-blur-md shadow-2xl h-[calc(100vh-4rem)] transform transition-all duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            Home
          </Link>
          <Link
            to="/job"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            Find Jobs
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            How It Works
          </Link>
          <hr className="my-4 border-gray-200" />
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-red-600 hover:text-red-700 transition-all duration-200 text-lg font-semibold py-2 hover:bg-red-50 rounded-md px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
              >
                Sign In
              </Link>
              <Link
                to="/register/student"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-center font-semibold text-lg hover:bg-blue-800 transition-all duration-200 shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;