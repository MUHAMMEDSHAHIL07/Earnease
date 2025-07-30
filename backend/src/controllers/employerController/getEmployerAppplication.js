import { jobApplicationModel } from "../../models/jobApplication.js"
import { jobModel } from "../../models/jobSchema.js"

export const getEmployerApplication = async(req,res)=>{
    try{
        const employerid = req.user.id
        const employerJob = await jobModel.find({employer:employerid}).select("_id")
        const Jobid = employerJob.map((job)=>job._id)
        const application = await jobApplicationModel.find({job:Jobid})
        .populate("student","name email").populate("job","title")
        res.status(200).json({message:application})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}