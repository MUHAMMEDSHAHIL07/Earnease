import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const EmployerManagement = () => {
    const [employer, setEmployer] = useState([])
    const navigate= useNavigate()

    useEffect(() => {
        axios.get("http://localhost:5000/admin/getAllEmployer")
            .then((res) => setEmployer(res.data.employer))
            .catch(err => console.log(err.message))
    }, [])


    const block = (id) => {
        axios.patch(`http://localhost:5000/admin/employerStatus/${id}`, { isBlocked: true }, { withCredentials: true })
            .then(() => {
                setEmployer((prev) =>
                    prev.map((employer) =>
                        employer._id === id ? { ...employer, isBlocked: true } : employer
                    )
                )
                toast.info("block successfully")
            })
            .catch((error) => {
                console.error(error.message);
                const msg = error.response?.data?.message || error.message
                toast.error(msg);
            });
    }
    const unBlock = (id) => {
        axios.patch(`http://localhost:5000/admin/employerStatus/${id}`, { isBlocked: false }, { withCredentials: true })
            .then(() => {
                setEmployer((prev) =>
                    prev.map((employer) =>
                        employer._id === id ? { ...employer, isBlocked: false } : employer
                    )
                )
                toast.success("unblock successfully")
            })
            .catch((error) => {
                console.error(error.message);
                toast.error(error.message);
            });
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">Employer Management</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">View</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employer.map((employer) => (
                                <tr key={employer._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium">{employer.companyname}</td>
                                    <td className="px-4 py-3">{employer.email}</td>
                                    <td className="px-4 py-3">{new Date(employer.joined).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        {employer.isBlocked ? (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded">Blocked</span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded">Active</span>
                                        )}
                                    </td>

                                   
                                    <td className="px-4 py-3">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                            onClick={() => navigate(`/admin/employerview/${employer._id}`)}
                                        >
                                            View
                                        </button>
                                    </td>

                                    <td className="px-4 py-3">
                                        {employer.isBlocked ? (
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                                onClick={() => unBlock(employer._id)}
                                            >
                                                Unblock
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => block(employer._id)}
                                            >
                                                Block
                                            </button>
                                        )}
                                    </td>
                                </tr>

                            ))}

                            {employer.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                        No students available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployerManagement;
