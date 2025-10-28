import { employerModel } from "../../models/employerSchema.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import EmployerVerification from "../../models/employerVerifiySchema.js";
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})


export const getPendingVerification = async (req, res) => {
  try {
    const pending = await EmployerVerification
      .find({ status: "pending" })
      .populate("employerId", "companyname email createdAt")
    return res.status(200).json({ message: "data sent", pending })
  } catch (error) {
    return res.status(500).json({ message: "internal server error: " + error.message })
  }
}

export const getSingleVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await EmployerVerification
      .findById(id)
      .populate("employerId", "companyname email createdAt");

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" })
    }

    res.status(200).json({ verification });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message })
  }
}



export const approveEmployer = async (req, res) => {
    try {
        const verificationId = req.params.id

        const verification = await EmployerVerification.findById(verificationId)
        if (!verification) {
            return res.status(404).json({ message: "Verification not found" })
        }

        const employer = await employerModel.findById(verification.employerId)
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" })
        }

        verification.status = "approved"
        verification.isVerified = true
        employer.status = "approved"
        employer.isVerified = true

        await verification.save()
        await employer.save()
        res.status(200).json({ success: true, message: "Employer rejected successfully" })

        transporter.sendMail({
            to: employer.email,
            subject: "Employer Verification Successful",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center;">
                        <img src="https://media.istockphoto.com/id/948531554/vector/approved-ink-stamp.jpg?s=612x612&w=0&k=20&c=kVKJxtXo1QOxDoqTvAdxHEjuVlcRvxGN-1f6qvyimRA=" alt="Success" style="margin-bottom: 20px;" />
                        <h2 style="color: #2E7D32;">Verification Successful!</h2>
                    </div>
                    <p style="font-size: 16px; color: #444;">Dear Employer,</p>
                    <p style="font-size: 16px; color: #444;">
                        We are pleased to inform you that your <strong>employer verification</strong> has been successfully completed. 
                        Your profile is now live, and you can access your dashboard and start managing your jobs.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/login" style="background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Log In Now
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #999;">
                        If you have any questions or need assistance, feel free to reach out to our support team.
                    </p>
                    <p style="font-size: 14px; color: #444;">
                        Best regards,<br/>
                        <strong>Earnease Support Team</strong>
                    </p>
                </div>
            `,
        })

      .then(() => console.log("Approval email sent"))
      .catch((err) => console.log("Email send failed", err.message))
    } catch (err) {
        console.error("Error in approveEmployer:", err)
        return res.status(500).json({ message: err.message })
    }
}

export const rejectEmployer = async (req, res) => {
    try {
        const { rejectionReason } = req.body || {}
        const verificationId = req.params.id

        const verification = await EmployerVerification.findById(verificationId)
        if (!verification) {
            return res.status(404).json({ message: "Verification not found" })
        }

        const employer = await employerModel.findById(verification.employerId)
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" })
        }


        verification.status = "rejected"
        verification.isVerified = false
        verification.rejectionReason = rejectionReason || verification.rejectionReason
        employer.status = "rejected"
        employer.isVerified = false

        await verification.save()
        await employer.save()
        res.status(200).json({ success: true, message: "Employer rejected successfully" })

        transporter.sendMail({
            to: employer.email,
            subject: "Employer Verification Unsuccessful",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff3f3;">
                    <div style="text-align: center;">
                        <img src="https://media.istockphoto.com/id/949546382/vector/rejected-ink-stamp.jpg?s=612x612&w=0&k=20&c=S8MRCa7JMK7cSNvQwflyDLyMzXAZ3ng3vRw7rVP9eNU=" alt="Rejected" style="margin-bottom: 20px;" />
                        <h2 style="color: #d32f2f;">Verification Unsuccessful</h2>
                    </div>
                    <p style="font-size: 16px; color: #444;">Dear Employer,</p>
                    <p style="font-size: 16px; color: #444;">
                        We regret to inform you that your <strong>employer verification</strong> could not be completed at this time.
                    </p>
                    ${rejectionReason ? `<p style="font-size: 16px; color: #444;"><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/register" style="background-color: #d32f2f; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Reapply Now
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #999;">
                        If you believe this decision was made in error or need further clarification, feel free to contact our support team.
                    </p>
                    <p style="font-size: 14px; color: #444;">
                        Best regards,<br/>
                        <strong>Earnease Support Team</strong>
                    </p>
                </div>
            `,
        })
      .then(() => console.log("Rejection email sent"))
      .catch((err) => console.error("Email send failed",err.message))

    } catch (err) {
        console.error("Error in rejectEmployer:", err)
        return res.status(500).json({ message: err.message })
    }
}