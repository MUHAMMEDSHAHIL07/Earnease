import mongoose from "mongoose"
import { employerModel } from "../../models/employerSchema.js"
import { paymentModel } from "../../models/paymentSchema.js"

export const monthlySpending = async (req, res) => {
    try {
        const employerId = req.user.id
        const employer = await employerModel.findById(employerId)
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" })
        }
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const spendingAgg = await paymentModel.aggregate([
            {
                $match: {
                    employer: new mongoose.Types.ObjectId(employerId),
                    status: "captured",
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            }
        ])
        const totalSpending = spendingAgg[0]?.total || 0
        return res.status(200).json({ monthlySpending: totalSpending })
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}