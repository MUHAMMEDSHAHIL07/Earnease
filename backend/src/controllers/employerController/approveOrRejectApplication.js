import { jobApplicationModel } from "../../models/jobApplication.js";
import { userModel } from "../../models/userSchema.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
console.log("Email User:", process.env.EMAIL_USER)
console.log("Email Pass:", process.env.EMAIL_PASS)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const approveJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await jobApplicationModel.findById(id).populate("student job");
    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }
    const student = await userModel.findById(application.student);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    application.status = "accepted";
    await application.save()

    await transporter.sendMail({
      to: student.email,
      subject: "Job Application Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Approved" style="width:80px; margin-bottom: 20px;" />
            <h2 style="color: #2E7D32;">Your Application Has Been Approved!</h2>
          </div>
          <p style="font-size: 16px; color: #444;">Dear ${student.name || "Student"},</p>
          <p style="font-size: 16px; color: #444;">
            Congratulations! Your application for the position of <strong>${application.job?.title || "a job"}</strong> has been approved.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/student/applications" style="background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              View Application
            </a>
          </div>
          <p style="font-size: 14px; color: #444;">
            Best regards,<br/>
            <strong>Earnease Team</strong>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Job application approved successfully" });
  } catch (err) {
    console.error("Error in approveJobApplication:", err);
    return res.status(500).json({ message: err.message });
  }
};


export const rejectJobApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await jobApplicationModel.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }
        const student = await userModel.findById(application.student);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        application.status = "rejected";
        await application.save();
        await transporter.sendMail({
            to: student.email,
            subject: "Job Application Unsuccessful",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff3f3;">
                    <div style="text-align: center;">
                        <img src="https://media.istockphoto.com/id/949546382/vector/rejected-ink-stamp.jpg?s=612x612&w=0&k=20&c=S8MRCa7JMK7cSNvQwflyDLyMzXAZ3ng3vRw7rVP9eNU=" alt="Rejected" style="margin-bottom: 20px;" />
                        <h2 style="color: #d32f2f;">Application Rejected</h2>
                    </div>
                    <p style="font-size: 16px; color: #444;">Dear ${student.name},</p>
                    <p style="font-size: 16px; color: #444;">
                        We regret to inform you that your application for the job position <strong>${application.jobTitle}</strong> was not successful this time.
                    </p>
                    <p style="font-size: 16px; color: #444;">
                        We encourage you to explore other opportunities on <strong>Earnease</strong> that match your profile and skills.
                    </p>
                    <a href="http://localhost:5173/jobs" style="background-color: #d32f2f; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Find More Jobs
                    </a>
                    <p style="font-size: 14px; color: #999; margin-top: 20px;">
                        If you need further clarification, feel free to contact our support team.
                    </p>
                    <p style="font-size: 14px; color: #444;">
                        Best regards,<br/>
                        <strong>Earnease Support Team</strong>
                    </p>
                </div>
            `,
        });

        return res.status(200).json({ success: true, message: "Student application rejected successfully" });

    } catch (err) {
        console.error("Error in rejectStudentApplication:", err);
        return res.status(500).json({ message: err.message });
    }
};