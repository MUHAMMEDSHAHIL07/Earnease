import { jobModel } from "../../models/jobSchema.js"

export const getAllJobs = async(req,res)=>{
    try{
        const jobs = await jobModel.find().populate("employer","companyname avatarUrl")
        if(jobs.length===0){
            return res.status(404).json({message:"no job find"})
        }
        return res.status(200).json({count:jobs.length,jobs})
    }
    catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}