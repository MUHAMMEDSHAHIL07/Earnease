import {jobModel} from "../../models/jobSchema.js"

export const jobPost = async(req,res)=>{
    try{
        const{title,Description,Location,Salary,Category,WorkHour,Gender} = req.body
        const newJob = new jobModel({
            employer:req.user.id,
            title,
            Description,
            Location,
            Salary,
            Category,
            WorkHour,
            Gender
        })
        await newJob.save()
        res.status(201).json({message:"job created",Job:newJob})
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

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