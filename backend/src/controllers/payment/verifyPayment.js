import crypto from "crypto";
import { employerModel } from "../../models/employerSchema.js";
import { razorpay } from "../../config/razorpay.js";
import { paymentModel } from "../../models/paymentSchema.js";


export const verifyPayment = async (req, res) => {
  try {
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,subscriptionType,amount} = req.body

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
    });

    return res.json({
      success: true,
      message: "Payment verified and saved successfully"
    });
  } catch (error) {
    console.error("Error verifying payment:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}