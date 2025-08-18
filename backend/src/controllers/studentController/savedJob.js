import { SavedJobModel } from "../../models/savedJobsSchema.js"

export const postSavedJob = async (req, res) => {
    try {
        const { jobId } = req.body
        const studentId = req.user.id
        const existingJob = await SavedJobModel.findOne({ student: studentId, job: jobId })
        if (existingJob) {
            return res.status(404).json({ message: "This job already saved" })
        }
        const saved = new SavedJobModel({
            student: studentId,
            job: jobId
        })
        await saved.save()
        return res.status(200).json({ message: "Saved Job succesfully" })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getSavedJob = async (req, res) => {
    try {
        const studentId = req.user.id
        const getSavedJob = await SavedJobModel.find({ student: studentId }).populate({
        path: "job",
        populate: {
          path: "employer",
          select: "companyname avatarUrl" 
        }
      })
      .populate("student", "name email")
        return res.status(200).json(getSavedJob)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteSavedJob = async (req, res) => {
    try {
        const studentId = req.user.id
        const { id } = req.params

        const deletedJob = await SavedJobModel.findOneAndDelete({
            _id: id,
            student: studentId
        })
        if (!deletedJob) {
            return res.status(404).json({ message: "Saved job not found" })
        }
        return res.status(200).json({ message: "Job removed from saved jobs" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}