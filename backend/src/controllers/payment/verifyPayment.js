import crypto from "crypto";
import { employerModel } from "../../models/employerSchema.js";
import { razorpay } from "../../config/razorpay.js";
import { paymentModel } from "../../models/paymentSchema.js";
import { jobApplicationModel } from "../../models/jobApplication.js";


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionType } = req.body

    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" })
    }

    const paymentData = await razorpay.payments.fetch(razorpay_payment_id)
    const now = new Date()
    let expiry
    if (subscriptionType === "single" || subscriptionType === "monthly")
      expiry = new Date(now.setMonth(now.getMonth() + 1))
    if (subscriptionType === "yearly")
      expiry = new Date(now.setFullYear(now.getFullYear() + 1))

    await employerModel.findByIdAndUpdate(req.user.id, {
      isSubscribed: true,
      subscriptionType,
      subscriptionStartDate: new Date(),
      subscriptionExpiry: expiry,
      subscriptionPostCount: 0
    })

    await paymentModel.create({
      paymentId: paymentData.id,
      employer: req.user.id,
      amount: paymentData.amount / 100,
      status: paymentData.status,
      method: paymentData.method,
      description: `${subscriptionType} subscription payment`,
      createdAt: new Date(paymentData.created_at * 1000)
    })
    await recentActivityModel.create({
      employer: req.user.id,
      type: "Payment",
      description: `Your payment for the ${subscriptionType} subscription was successful`
    })

    return res.json({
      success: true,
      message: "Payment verified and saved successfully"
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export const verifyPaymentCompletedJob = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const applicationId = req.params.id

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" })
    }

    const paymentData = await razorpay.payments.fetch(razorpay_payment_id)

    const jobApp = await jobApplicationModel
      .findByIdAndUpdate(
        applicationId,
        { $set: { paymentStatus: "paid", status: "completed" } },
        { new: true }
      )
      .populate("job", "title")
      .populate("student", "name email")

    if (!jobApp) {
      return res.status(404).json({ message: "Job application not found" })
    }

    await paymentModel.create({
      paymentId: razorpay_payment_id,
      employer: req.user.id,
      student: jobApp.student?._id,
      job: jobApp.job?._id,
      amount: paymentData.amount / 100,
      status: "paid",
      method: paymentData.method,
      description: `Payment for job: ${jobApp.job.title}`,
      paymentReceivedDate: new Date(),
      createdAt: new Date()
    })

    res.status(200).json({ message: "Payment verified and job completed" })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}
