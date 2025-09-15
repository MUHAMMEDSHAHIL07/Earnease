import { employerModel } from "../../models/employerSchema.js"
import EmployerVerification from "../../models/employerVerifiySchema.js"

export const getProfileEmployer = async(req,res)=>{
    try{
        const employerId = req.user.id
        const employer = await employerModel.findById(employerId).select("email companyname phonenumber ")
        const verification = await EmployerVerification.findOne({employerId})

        if(!employer){
            return res.status(404).json({message:"no employer found"})
        }
        res.status(200).json({
            employer,verification
        })
    }
    catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}