import { employerModel } from "../../models/employerSchema.js"
import {jobModel} from "../../models/jobSchema.js"

export const jobPost = async(req, res) => {
  try {
    const {title, Description, Location, Salary, Category, WorkHour, Gender} = req.body
    const employer = await employerModel.findById(req.user.id)

    if (!employer) {
      return res.status(404).json({ message: "No employer found" })
    }
    if (employer.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" })
    }

    const now = new Date();

    if (!employer.isSubscribed || !employer.subscriptionExpiry || employer.subscriptionExpiry < now) {
      if (employer.jobPostCount >= 3) { 
        return res.status(403).json({ message: "Free job limit reached. Please subscribe" });
      }
      employer.jobPostCount += 1
    } else {
      const planCheck = {
        single: employer.singlePostLimit,
        monthly: employer.monthlyPostLimit, 
        yearly: employer.yearlyPostLimit
      };
      const currentPlanLimit = planCheck[employer.subscriptionType] || "free"

      if (employer.subscriptionPostCount >= currentPlanLimit) {
        return res.status(403).json({ message: "Your subscription job limit has been reached. Please upgrade." })
      }
      employer.subscriptionPostCount += 1
    }
    
    await employer.save();
    const newJob = new jobModel({
      employer: req.user.id,
      title,
      Description,
      Location,
      Salary,
      Category,
      WorkHour,
      Gender
    });

    await newJob.save();

    return res.status(201).json({ message: "Job created", Job: newJob })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};


export const getAllJob = async(req,res)=>{
    try{
        const getJob = await jobModel.find({employer:req.user.id})
        return res.status(200).json({getJob})
    }
    catch(error){
        return res.status(500).json(error.message)
    }
}
export const getJobById = async(req,res)=>{
    try{
        const getJob = await jobModel.findOne({_id:req.params.id,employer:req.user.id})
        if(!getJob) return res.status(404).json({message:"job not found"})
            return res.status(200).json({ getJob: getJob }); 
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

export const editJob = async(req,res)=>{
    try{
        const editJob = await jobModel.findOneAndUpdate({_id:req.params.id,employer:req.user.id},{$set:req.body})
        if(!editJob) return res.status(404).json("job not found")
            return res.status(200).json({message:editJob})
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

export const deleteJob = async(req,res)=>{
    try{
        const jobDelete = await jobModel.findOneAndDelete({_id:req.params.id,employer:req.user.id})
        if(!jobDelete) return res.status(404).json({message:"no job found"})
            res.status(200).json({message:"job deleted successfully"})
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}