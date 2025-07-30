import { employerModel } from "../../models/employerSchema.js";
import EmployerVerification from "../../models/employerVerifiySchema.js";


export const getPendingVerification = async (req, res) => {
  try {
    const pending = await EmployerVerification
      .find({ status: "pending" })
      .populate("employerId", "companyname email createdAt");
    return res.status(200).json({ message: "data sent", pending });
  } catch (error) {
    return res.status(500).json({ message: "internal server error: " + error.message });
  }
};

export const getSingleVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await EmployerVerification
      .findById(id)
      .populate("employerId", "companyname email createdAt");

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.status(200).json({ verification });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


export const approveEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const verification = await EmployerVerification.findById(id);
    if (!verification)
      return res.status(404).json({ message: "no user found" });

    await employerModel.findByIdAndUpdate(verification.employerId, { isVerified: true });
    verification.status = "approved";
    verification.isVerified = true;
    await verification.save();

    return res.status(200).json({ message: "employer verified" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error: " + error.message });
  }
};


export const rejectEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const verification = await EmployerVerification.findById(id);
    if (!verification)
      return res.status(404).json({ message: "user not found" });

    await employerModel.findByIdAndUpdate(verification.employerId, { isVerified: false });
    verification.status = "rejected";
    verification.isVerified = false;
    await verification.save();

    return res.status(200).json({ message: "employer rejected" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error: " + error.message });
  }
};

