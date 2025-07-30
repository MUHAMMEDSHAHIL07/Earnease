import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const StudentManagement = () => {
    const [student, setStudent] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/admin/getAllStudent")
            .then((res) => setStudent(res.data.student))
            .catch((error) => {
                console.error(error.message);
                const msg = error.response?.data?.message || error.message
                toast.error(msg);
            });
    }, [])
    console.log(student);

    const block = (id) => {
        axios.patch(`http://localhost:5000/admin/userStatus/${id}`, { isBlocked: true }, { withCredentials: true })
            .then(() => {
                setStudent((prev) =>
                    prev.map((student) =>
                        student._id === id ? { ...student, isBlocked: true } : student
                    )
                )
                toast.success("block successfully")
            })
            .catch((error) => {
                console.error(error.message);
                const msg = error.response?.data?.message || error.message
                toast.error(msg);
            });
    }
    const unBlock = (id) => {
        axios.patch(`http://localhost:5000/admin/userStatus/${id}`, { isBlocked: false }, { withCredentials: true })
            .then(() => {
                setStudent((prev) =>
                    prev.map((student) =>
                        student._id === id ? { ...student, isBlocked: false } : student
                    )
                )
                toast.info("block successfully")
            })
            .catch((error) => {
                console.error(error.message);
                toast.error(error.message);
            });
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">Student Management</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.map((student) => (
                                <tr key={student._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium">{student.name}</td>
                                    <td className="px-4 py-3">{student.email}</td>
                                    <td className="px-4 py-3">{new Date(student.joined).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        {student.isBlocked ? (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded">
                                                Blocked
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 flex gap-3 items-center">
                                        {student.isBlocked ? (
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                                onClick={() => unBlock(student._id)} 
                                            >
                                                Unblock
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => block(student._id)} 
                                            >
                                                Block
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}

                            {student.length === 0 && (
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

export default StudentManagement;
