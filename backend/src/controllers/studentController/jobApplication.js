import { jobApplicationModel } from "../../models/jobApplication.js"
import { jobModel } from "../../models/jobSchema.js"


export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const studentId = req.user.id;

    const job = await jobModel.findById(jobId).populate("employer");
    if (!job) return res.status(404).json({ message: "No job found" });

    const alreadyApplied = await jobApplicationModel.findOne({
      job: job._id,
      student: studentId,
    });

    if (alreadyApplied)
      return res.status(400).json({ message: "Application already submitted" });

    const newApplication = new jobApplicationModel({
      job: job._id,
      employer: job.employer._id,
      student: studentId,
    });

    await newApplication.save();
    res.status(201).json({ message: "Applied for job successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
