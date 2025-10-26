import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    })

    await transporter.sendMail({
      from: 'Earnease <earneasejobportal@gmail.com>',
      to,
      subject,
      text: text || "Your email client does not support HTML",
      html,
    })

    console.log(`Email sent successfully to ${to} with subject: ${subject}`)
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error)
    throw new Error('Failed to send email')
  }
}