import { employerModel } from "../../models/employerSchema.js"
import { jobApplicationModel } from "../../models/jobApplication.js"

export const candidateHired = async (req, res) => {
    try {
        const employerId = req.user.id
        const employer = await employerModel.findById(employerId)
        if (!employer) {
            return res.status(404).json({ message: "no employer found" })
        }
        const totalHired = await jobApplicationModel.countDocuments({
            employer: employerId,
            status: "accepted",
        })
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const hiredThisMonth = await jobApplicationModel.countDocuments({
            employer: employerId,
            status: "accepted",
            appliedAt: { $gte: startOfMonth },
        })
        return res.status(200).json({totalHired,hiredThisMonth})
    }
    catch(err){
        return res.status(500).json(err.message)
    }
}