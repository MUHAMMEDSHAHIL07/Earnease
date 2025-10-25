import { employerModel } from "../../models/employerSchema.js"
import EmployerVerification from "../../models/employerVerifiySchema.js"
import { jobApplicationModel } from "../../models/jobApplication.js"
import { userModel } from "../../models/userSchema.js"

export const dashboardStat = async(req,res)=>{
    try{
        const totalStudent = await userModel.countDocuments()
        const totalEmployer = await employerModel.countDocuments({isVerified: true})
        const PendingEmployer = await EmployerVerification.countDocuments({status:"pending"})
        const postedJob = await jobApplicationModel.countDocuments()

        res.status(200).json({
            totalStudent,
            totalEmployer,
            PendingEmployer,
            postedJob
        })
    }
    catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}