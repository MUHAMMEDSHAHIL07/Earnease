import { recentActivityModel } from "../../models/recentActivity.js"

export const recentActivity = async (req, res) => {
    try {
        const employerId = req.user.id
        const activities = await recentActivityModel.find({ employer: employerId }).sort({ createdAt: -1 }).limit(10)
        res.status(200).json({ data:activities })
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}