import { jobApplicationModel } from "../../models/jobApplication.js";
import { userModel } from "../../models/userSchema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { chatRoomModel } from "../../models/chatRoom.js";

dotenv.config();

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
    const application = await jobApplicationModel.findById(id).populate("student job employer");
    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    const student = await userModel.findById(application.student);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    application.status = "accepted";
    await application.save();

    let chatRoom = await chatRoomModel.findOne({ jobApplication: application._id });
    if (!chatRoom) {
      chatRoom = new chatRoomModel({
        jobApplication: application._id,
        employer: application.employer._id,
        student: application.student._id,
        isActive: true,
      });
    } else {
      chatRoom.isActive = true;
    }
    await chatRoom.save();

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
          <p style="font-size: 16px; color: #444;">Now you can start chatting with the employer inside Earnease 🚀.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/student/applications" style="background-color: #4CAF50; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              View Application & Chat
            </a>
          </div>
          <p style="font-size: 14px; color: #444;">
            Best regards,<br/>
            <strong>Earnease Team</strong>
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Job application approved & chat unlocked",
      chatRoomId: chatRoom._id,
    });
  } catch (err) {
    console.error("Error in approveJobApplication:", err);
    return res.status(500).json({ message: err.message });
  }
}

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

    await chatRoomModel.findOneAndUpdate(
      { jobApplication: application._id },
      { isActive: false }
    );
    
    await transporter.sendMail({
      to: student.email,
      subject: "Job Application Unsuccessful",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff3f3;">
          <div style="text-align: center;">
            <h2 style="color: #d32f2f;">Application Rejected</h2>
          </div>
          <p style="font-size: 16px; color: #444;">Dear ${student.name},</p>
          <p style="font-size: 16px; color: #444;">
            We regret to inform you that your application for the job position <strong>${application.jobTitle || "the job"}</strong> was not successful this time.
          </p>
          <p style="font-size: 16px; color: #444;">
            Please explore other opportunities on <strong>Earnease</strong>.
          </p>
          <a href="http://localhost:5173/jobs" style="background-color: #d32f2f; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Find More Jobs
          </a>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Student application rejected & chat locked" });
  } catch (err) {
    console.error("Error in rejectStudentApplication:", err);
    return res.status(500).json({ message: err.message });
  }
};