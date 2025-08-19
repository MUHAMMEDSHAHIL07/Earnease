import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, IndianRupee, Clock, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobDetail = () => {
    const { id } = useParams()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/student/getJob/${id}`,
                    { withCredentials: true }
                )
                setJob(res.data)
            } catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        };
        fetchJob()
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-gray-600 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen flex justify-center py-10">
                <div className="bg-white w-full md:w-2/5 lg:w-2/5 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6 flex items-center gap-5">
                        {job?.employer?.avatarUrl && (
                            <img
                                src={job?.employer.avatarUrl}
                                alt={job.company}
                                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{job.title}</h1>
                            <p className="text-sm opacity-90">Company: {job?.employer?.companyname}</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-5">
                            {job?.Skills?.split(",").map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-3 py-1 rounded-full text-xs font-medium hover:scale-105 transition-transform cursor-pointer shadow-sm"
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 mb-5 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" /> {job?.Location}
                            </div>
                            <div className="flex items-center gap-2">
                                <IndianRupee size={16} className="text-green-500" /> {job?.Salary}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-yellow-500" /> {job?.WorkHour}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={16} className="text-pink-500" /> {job?.Category}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-purple-500" /> {job?.Gender}
                            </div>
                        </div>


                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-1 border-b border-gray-200 pb-1">
                                Job Description
                            </h2>
                            <p className="text-gray-700 text-sm">{job?.Description}</p>
                        </div>


                        {job.requirements && (
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold mb-1 border-b border-gray-200 pb-1">
                                    Requirements
                                </h2>
                                <ul className="list-disc list-inside text-gray-700 text-sm">
                                    {job.requirements?.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.contact && (
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold mb-1 border-b border-gray-200 pb-1">
                                    Contact
                                </h2>
                                <p className="text-gray-700 text-sm">{job.contact}</p>
                            </div>
                        )}


                        <div className="flex justify-center">
                            <button className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 rounded-lg hover:scale-105 hover:shadow-md transition-transform font-semibold text-sm">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobDetail