import React, { useEffect, useState } from 'react';
import {User, Mail, Phone, MapPin, Calendar,GraduationCap, Award, FileText, Briefcase,Upload, Camera, X} from 'lucide-react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const SkillsInput = ({ skills, setSkills }) => {
    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
            e.preventDefault();
            const newSkill = inputValue.trim().replace(/,$/, '')
            if (newSkill && !skills.includes(newSkill)) {
                setSkills([...skills, newSkill])
                setInputValue("")
            }
        }
    }

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove))
    }

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Award size={16} className="text-blue-500" />
                Skills
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70">
                <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-white/80 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Enter skills and press Enter or comma"
                    className="w-full bg-transparent placeholder-gray-400 text-gray-700 focus:outline-none"
                />
            </div>
          
        </div>
    );
};

const InputField = React.memo(({
    icon: Icon,
    label,
    name,
    type = "text",
    placeholder,
    multiline = false,
    rows = 3,
    required = false,
    isDropdown = false,
    options = [],
    formData,
    setFormData
}) => {
    const handleChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon size={16} className="text-blue-500" />
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {isDropdown ? (
                <select
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 text-gray-700"
                >
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            ) : multiline ? (
                <textarea
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 placeholder-gray-400 text-gray-700 resize-none"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 placeholder-gray-400 text-gray-700"
                />
            )}
        </div>
    );
});

const EditStudentProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        availability: "Full-time",
        education: "",
        skills: [],
        bio: "",
        experience: "",
        avatarFile: null,
        avatarUrl: ""
    });

    const [completeProfile, setCompleteProfile] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/student/getprofile", {
                withCredentials: true,
            })
            .then((res) => {
                const student = res.data.student || {};
                setFormData({
                    name: student.name || "",
                    email: student.email || "",
                    phone: student.phonenumber || "",
                    skills: student.skills || [],
                    location: student.location || "",
                    availability: student.availability || "Full-time",
                    education: student.education || "",
                    experience: student.experience || "",
                    bio: student.bio || "",
                    avatarFile: null,
                    avatarUrl: student.avatarUrl || ""
                });
                setCompleteProfile(student.profileCompletionPercent || 0)
            })
            .catch(console.error)
    }, [])

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, avatarFile: e.target.files[0] }))
    }

    const handleSave = async () => {

        const data = new FormData()

        data.append("name", formData.name)
        data.append("email", formData.email)
        data.append("phonenumber", formData.phone)
        data.append("location", formData.location)
        data.append("availability", formData.availability)
        data.append("education", formData.education)
        data.append("bio", formData.bio)
        data.append("experience", formData.experience)

        formData.skills.forEach(skill => {
            data.append("skills", skill)
        })

        if (formData.avatarFile) {
            data.append("avatarUrl", formData.avatarFile)
        }

        try {
            const res = await toast.promise(
                axios.patch(
                    "http://localhost:5000/api/student/editprofile",
                    data,
                    { withCredentials: true }
                ),
                {
                    loading: "Updating profile...",
                    success: "Profile updated successfully!",
                    error: "Failed to update profile."
                }
            );

            setCompleteProfile(res.data.updatedProfile.profileCompletionPercent)
            setFormData(prev => ({ ...prev, avatarUrl: res.data.updatedProfile.avatarUrl }))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div />
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>Profile Completion</span>
                    {completeProfile !== null && (
                        <>
                            <span className="font-semibold text-blue-600">
                                {completeProfile}%
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                                    style={{ width: `${completeProfile}%` }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Camera size={20} className="text-blue-500" />
                                        Profile Photo
                                    </h3>
                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                        <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 bg-transparent">
                                            {formData.avatarUrl || formData.avatarFile ? (
                                                <img
                                                    src={formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : formData.avatarUrl}
                                                    alt="Profile preview"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                                    <Upload size={32} className="mb-2" />
                                                    <span className="text-sm text-center px-2">
                                                        Drop photo here or click to upload
                                                    </span>
                                                </div>
                                            )}
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                name="avatarUrl"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </label>
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Recommended: Square image, at least 200x200px
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <InputField
                                        icon={User}
                                        name="name"
                                        label="Full Name"
                                        required
                                        placeholder="Enter your full name"
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={Mail}
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        required
                                        placeholder="your.email@example.com"
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={Phone}
                                        name="phone"
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={MapPin}
                                        name="location"
                                        label="Location"
                                        placeholder="City, State/Country"
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={Calendar}
                                        name="availability"
                                        label="Availability"
                                        isDropdown
                                        options={["Full-time", "Part-time", "Weekend", "Remote"]}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={GraduationCap}
                                        name="education"
                                        label="Education"
                                        placeholder="Degree, University"
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </div>

                                <div className="mt-6">
                                    <SkillsInput
                                        skills={formData.skills}
                                        setSkills={(newSkills) => setFormData(prev => ({ ...prev, skills: newSkills }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    <InputField
                                        icon={FileText}
                                        name="bio"
                                        label="Bio"
                                        placeholder="Tell us about yourself..."
                                        multiline
                                        rows={4}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <InputField
                                        icon={Briefcase}
                                        name="experience"
                                        label="Experience"
                                        placeholder="Describe your experience..."
                                        multiline
                                        rows={4}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <button
                                    type="button"
                                    className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    type="button"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditStudentProfile