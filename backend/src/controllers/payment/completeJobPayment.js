import { razorpay } from "../../config/razorpay.js";
import { jobApplicationModel } from "../../models/jobApplication.js"

export const completeJob = async (req, res) => {
    try {
        const jobApp = await jobApplicationModel.findById(req.params.id).populate("job")
        if (!jobApp) return res.status(404).json({ message: "No job found" })
        if (jobApp.status !== "accepted") return res.status(400).json({ message: "Job not accepted yet" })
        if (jobApp.paymentStatus === "paid") return res.status(400).json({ message: "Already paid" })

        const options = {
            amount: jobApp.job.Salary * 100,
            currency: "INR",
            receipt: `job_${jobApp._id}`,
        }
        const order = await razorpay.orders.create(options)
        res.status(200).json({ orderId: order.id, amount: order.amount })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}