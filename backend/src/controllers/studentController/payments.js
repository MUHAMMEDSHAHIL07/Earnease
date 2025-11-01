import { paymentModel } from "../../models/paymentSchema.js"

export const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.user.id

    const payments = await paymentModel
      .find({ student: studentId })
      .populate("employer", "companyName email")
      .populate("job", "title")
      .sort({ paymentReceivedDate: -1 })

    res.status(200).json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}