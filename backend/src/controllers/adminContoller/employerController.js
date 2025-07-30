import { employerModel } from "../../models/employerSchema.js"
import EmployerVerification from "../../models/employerVerifiySchema.js"

//get all employer
export const getEmployer = async (req, res) => {
  try {
    const employer = await employerModel.find().select("-password")
    res.status(200).json({ employer })
  }
  catch (error) {
    return res.status(500).json({ message: "internal server error" })
  }
}

//get employer by id

export const getEmployerById = async (req, res) => {
  try {
    const employerId = req.params.id
    const verification = await EmployerVerification.findOne({ employerId })
    if (!verification) return res.status(404).json({ message: "no verification found" })
    const employer = await employerModel.findById( employerId )
    if (!employer) return res.status(404).json({ message: "no employer" })
    return res.status(200).json({
      verification,
      employer
      
    })
  }
  catch (error) {
    res.status(500).json({ message: "internal server error" })
  }

}

//block and unblock employer

export const BlockUnblockEmployer = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isBlocked } = req.body;

    const user = await employerModel.findByIdAndUpdate(
      userId,
      { isBlocked },
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: isBlocked ? "Employer blocked successfully" : "Employer unblocked successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update status" });
  }
};