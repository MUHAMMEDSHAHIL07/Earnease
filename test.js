import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../admin/videoPlayer";
import { toast, ToastContainer } from 'react-toastify';

function InstructorVerification() {
    const [data, setData] = useState(null);
    const [rejectedReason, setRejctedReason] = useState("")
    const [rejectSubmiting, setRejectSubmiting] = useState(false)
    const [approveSubmiting, setApproveSubmiting] = useState(false)
    const { id } = useParams();
    const navigate=useNavigate()

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const res = await axios.get(http://localhost:5000/api/admin/instructorById/${id},{withCredentials: true});
                setData(res.data?.data);
            } catch (error) {
                console.error("Error fetching instructor:", error);
            }
        };
        fetchInstructor();
    }, [id]);

    if (!data) return <div className="p-6 text-center text-gray-500">Loading instructor data...</div>;

    const {
        avatar,
        name,
        email,
        linkedInProfile,
        skills = [],
        bio,
        demoVideo,
        documents = {},
        _id
    } = data;

    const { experienceLetter, degreeCertificate, certification, idProof } = documents;


    function Approved() {
        setApproveSubmiting(true)
        axios.post("http://localhost:5000/api/admin/approvedOrRejected", { id: _id, verificationStatus: "approved", email: email },{withCredentials: true})
            .then((res) => {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/adminDashboard')
                }, 2000);
            }
            )
            .catch((err) => toast.error(err.response?.data?.message || err.message))
            .finally(() => setApproveSubmiting(false))
    }

    function Rejected() {
        if (rejectedReason.length === 0) {
            return toast.warning("please write the reason")
        }
        setRejectSubmiting(true)
        axios.post("http://localhost:5000/api/admin/approvedOrRejected", { id: _id, verificationStatus: "rejected", email: email, rejectionReason: rejectedReason },{withCredentials: true})
            .then((res) => {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/adminDashboard')
                }, 2000);
            })
            .catch((err) => toast.error(err.response?.data?.message || err.message))
            .finally(() => setRejectSubmiting(false))
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-gray-800">
            <h1 className="text-2xl font-bold mb-6">Instructor Verification</h1>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow">
                <div className="space-y-3">
                    <img src={avatar} alt={name} className="w-24 h-24 rounded-full object-cover" />
                    <Info label="Full Name" value={name} />
                    <Info label="Email Address" value={email} />
                    <div>
                        <p className="text-sm text-gray-500">LinkedIn Profile</p>
                        <a href={linkedInProfile} className="text-indigo-600 underline break-all" target="_blank" rel="noopener noreferrer">
                            {linkedInProfile}
                        </a>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <SkillSection skills={skills} />
                    <Info label="Short Bio" value={bio || "No bio available."} />
                </div>
            </div>

            {/* Documents Section */}
            <div className="mt-8 space-y-6">
                <h2 className="text-lg font-semibold">Document Verification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentCard title="Demo Teaching Video" isVideo>
                        {demoVideo ? <VideoPlayer videoUrl={demoVideo} /> : <FallbackMessage text="Demo video not available." />}
                    </DocumentCard>
                    <DocumentCard title="Experience Letter" image={experienceLetter} />
                    <DocumentCard title="Degree Certificate" image={degreeCertificate} />
                    <DocumentCard title="Teaching Certificate" image={certification} />
                    <DocumentCard title="Government ID" image={idProof} />
                </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <textarea
                    placeholder="Rejection Reason (Optional)"
                    className="w-full border rounded p-3 mb-4 text-sm"
                    rows={3}
                    value={rejectedReason}
                    onChange={(e) => setRejctedReason(e.target.value)}
                />
                <div className="flex justify-end gap-4">
                    <button className="bg-red-100 text-red-600 px-4 py-2 rounded" onClick={() => Rejected()}>
                        {rejectSubmiting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                rejecting...
                            </>
                        ) : (
                            "Reject Application"
                        )}
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => Approved()}>
                        {approveSubmiting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Approving...
                            </>
                        ) : (
                            "Approve Application"
                        )}
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

const Info = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
    </div>
);

const SkillSection = ({ skills }) => (
    <div>
        <p className="text-sm text-gray-500">Skills</p>
        <div className="flex gap-2 flex-wrap">
            {skills.length > 0 ? (
                skills.map(skill => (
                    <span key={skill} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{skill}</span>
                ))
            ) : (
                <span className="text-sm text-gray-400">No skills provided.</span>
            )}
        </div>
    </div>
);

const DocumentCard = ({ title, image, children, isVideo = false }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <p className="mb-2 text-sm font-medium">{title}</p>
        {isVideo ? (
            children
        ) : image ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
        ) : (
            children || <FallbackMessage text={${title} not available.} />
        )}
    </div>
);

const FallbackMessage = ({ text }) => (
    <p className="text-sm text-gray-400 italic">{text}</p>
);

export default React.memo(InstructorVerification);