import { chatRoomModel } from "../../models/chatRoom.js";
import { jobApplicationModel } from "../../models/jobApplication.js"
export const getStudentJobList = async (req, res) => {
    try {
        const studentId = req.user.id;
        let applications = await jobApplicationModel
            .find({ student: studentId })
            .populate("job", "title Location Salary Category")
            .populate("employer", "companyname avatarUrl")
            .sort({ appliedAt: -1 })
             .lean();
        for (let app of applications) {
            const chatRoom = await chatRoomModel.findOne({
                jobApplication: app._id,
                student: studentId,
            }).select("_id");
            app.chatRoomId = chatRoom?._id || null;
        }
        res.status(200).json({ applications });
    } catch (error) {
       console.log(error.message)
        res.status(500).json({ message: "Server error" });
    }
};