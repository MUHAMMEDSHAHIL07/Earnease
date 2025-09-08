import { chatRoomModel } from "../../models/chatRoom.js";
import { jobApplicationModel } from "../../models/jobApplication.js"
import { jobModel } from "../../models/jobSchema.js"

export const getStudentApplication = async (req, res) => {
  try {
    const employerid = req.user.id;
    const employerJob = await jobModel.find({ employer: employerid }).select("_id");
    const Jobid = employerJob.map((job) => job._id);
    const { status } = req.query;
    const filter = { job: Jobid };
    if (status) filter.status = status;

    const applications = await jobApplicationModel
      .find(filter)
      .populate("student", "name email")
      .populate("job", "title")
      .lean();

    for (let app of applications) {
      const chatRoom = await chatRoomModel.findOne({
        jobApplication: app._id,
        employer: employerid,
      }).select("_id");

      app.chatRoomId = chatRoom ? chatRoom._id.toString() : null;
    }

    res.status(200).json({ message: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};