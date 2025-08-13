import {jobApplicationModel} from "../../models/jobApplication.js"
export const getStudentJobList = async (req, res) => {
    try {
        const studentId = req.user.id;
        const application = await jobApplicationModel.find({ student: studentId })
            .populate("job", "title Location Salary Category")
            .populate("employer", "companyname avatarUrl")
            .sort({ appliedAt: -1 });

        res.status(200).json({ application });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error" });
    }
};