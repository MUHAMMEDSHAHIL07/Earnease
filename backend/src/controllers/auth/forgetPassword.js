import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { userModel } from "../../models/userSchema.js";
import { employerModel } from "../../models/employerSchema.js";

export const forgetPassword = async (req, res) => {
  try {
    const { email, role } = req.body;
    let user;

    if (role === "student") {
      user = await userModel.findOne({ email });
    } else if (role === "employer") {
      user = await employerModel.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role. Please select the role correctly." });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You recently requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
              style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 15 minutes for your security.</p>
          <p>If you did not request this, please ignore this email. No changes will be made to your account.</p>
          <p>Regards,<br />Earn Ease</p>
        </div>
      `
    });

    return res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Forget password error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
