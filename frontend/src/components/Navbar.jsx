import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import axios from "axios"
import logo from "../assets/logo.png"
import Swal from "sweetalert2"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem("earneaseUser")
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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
              className="text-gray-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/job"
              className="text-gray-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200"
            >
              How It Works
            </Link>
            <Link
              to="/aboutus"
              className="text-gray-700 hover:text-blue-600 text-sm font-semibold transition-all duration-200"
            >
              About Us
            </Link>

            {user? (
              <div className="relative group">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover transition-transform duration-200 hover:scale-110"
                  />
                )}
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95 z-20">
                  <Link
                    to="/student-profile"
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
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
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <img src={logo} alt="Logo" className="h-10" />
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 space-y-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            Home
          </Link>
          <Link
            to="/job"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            Find Jobs
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            How It Works
          </Link>
          <Link
            to="/aboutus"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
          >
            About Us
          </Link>

          <hr className="my-4 border-gray-200" />

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 text-lg font-semibold py-2 hover:bg-blue-50 rounded-md px-3"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-red-600 hover:text-red-700 text-lg font-semibold py-2 hover:bg-red-50 rounded-md px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-center font-semibold text-lg hover:bg-blue-800 transition-all duration-200 shadow-md"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar