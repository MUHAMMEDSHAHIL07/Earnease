import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EarnEase OTP" <${process.env.EMAIL_USER}>`,
    to,
    subject: "EarnEase OTP Verification",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};