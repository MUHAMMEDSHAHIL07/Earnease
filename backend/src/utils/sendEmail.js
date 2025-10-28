import dotenv from "dotenv"
import Brevo from "@getbrevo/brevo"
dotenv.config()

export const sendEmail = async ({ to, subject, html, text }) => {
  console.log("Starting sendEmail function")
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi()
    const apiKey = apiInstance.authentications["apiKey"]
    apiKey.apiKey = process.env.BREVO_API_KEY
    console.log("API key loaded")

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.textContent = text || "Your email client does not support HTML"
    sendSmtpEmail.sender = { name: "Earnease", email: "earneasejobportal@gmail.com" }
    sendSmtpEmail.to = [{ email: to }]
    console.log("Sending email to:", to)

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log("Email sent successfully:", response)
  } catch (error) {
    console.error("Error sending email:", error?.response?.text || error.message || error)
  }
}