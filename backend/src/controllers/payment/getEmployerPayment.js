import { paymentModel } from "../../models/paymentSchema.js";

export const getEmployerPayments = async (req, res) => {
  try {
    const payments = await paymentModel.find({ employer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(payments)
  } catch (err) {
    console.error("Error fetching employer payments:", err)
    res.status(500).json({ message: "Server error" })
  }
}