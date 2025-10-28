import otpGenerator from 'otp-generator'
import { otpModel } from '../../models/otpModel.js'
import { sendEmail } from '../../utils/sendEmail.js'

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    console.log("Received email from frontend:", email)
    await otpModel.deleteMany({ email })

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    await otpModel.create({ email, otp })

    await sendEmail({
      to: email,
      subject: 'Your Verification Code for Earnease',
      text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
          <h2 style="color: #007bff;">Earnease Account Verification</h2>
          <p style="font-size: 16px;">Thank you for registering. Please use the following code to verify your email address.</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #f2f2f2; padding: 15px 25px; border-radius: 5px; display: inline-block; margin: 20px 0;">
            ${otp}
          </p>
          <p style="font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    })

    return res.status(200).json({ message: 'OTP sent' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to send OTP', error: error.message })
  }
}