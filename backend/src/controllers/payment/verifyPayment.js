import crypto from 'crypto';
import { employerModel } from "../../models/employerSchema.js";

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionType } = req.body
     const sign = razorpay_order_id + "|" + razorpay_payment_id 
     const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex')
     if(expectedSignature===razorpay_signature){
        const now = new Date()
        let expiry
        if(subscriptionType==="single") expiry =new Date(now.setMonth(now.getMonth() + 1))
        if (subscriptionType === "monthly") expiry = new Date(now.setMonth(now.getMonth() + 1))
        if (subscriptionType === "yearly") expiry = new Date(now.setFullYear(now.getFullYear() + 1))
            await employerModel.findByIdAndUpdate(req.user.id,{
                isSubscribed:true,
                subscriptionType,
                subscriptionStartDate:new Date(),
                subscriptionExpiry:expiry,
                subscriptionPostCount:0
            })
            return res.json({
                success:true,
                message:"Payment verified successfully"
            })
     }
  }
  catch (error) {
    console.error("Error verifying payment:", error)
    return res.status(500).json({success: false,message: "Internal server error"})
  }
}