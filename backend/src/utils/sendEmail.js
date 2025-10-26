import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: 'Earnease <earneasejobportal@gmail.com>',
      to: email,
      subject: 'Your Verification Code for Earnease',
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
      `
    });
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error);
    throw new Error('Failed to send OTP email.');
  }
};