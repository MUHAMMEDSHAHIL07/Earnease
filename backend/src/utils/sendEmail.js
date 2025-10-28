import dotenv from "dotenv"
import Brevo from "@getbrevo/brevo"
dotenv.config()

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi()
    const apiKey = apiInstance.authentications["apiKey"]
    apiKey.apiKey = process.env.BREVO_API_KEY

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.textContent = text || "Your email client does not support HTML"
    sendSmtpEmail.sender = { name: "Earnease", email: "earneasejobportal@gmail.com" }
    sendSmtpEmail.to = [{ email: to }]

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    return response
  } catch (error) {
    console.error("Error sending email:")
  }
}