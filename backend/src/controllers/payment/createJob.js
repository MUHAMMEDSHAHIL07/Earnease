import { razorpay } from "../../config/razorpay.js";

export const createJobPayment = async (req, res) => {
  try {
    const { subscriptionType,amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes:{subscriptionType,userId:req.user.id}
    };

    const response = await razorpay.orders.create(options);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};