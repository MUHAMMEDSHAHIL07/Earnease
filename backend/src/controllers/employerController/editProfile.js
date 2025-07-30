import { employerModel } from "../../models/employerSchema.js";
import EmployerVerification from "../../models/employerVerifiySchema.js";

export const editProfile = async(req,res)=>{
    try{
        const employerid = req.user.id
        const {email,avatarUrl,companyname,about,companyType,licenseUrl,location,contactNumber,industry,address,websiteUrl} = req.body;

        await employerModel.findByIdAndUpdate(employerid,{
            companyname,
            email,
            avatarUrl,
        }, { new: true } )

        await EmployerVerification.findOneAndUpdate({employerId: employerid},{
           companyType,about,licenseUrl,location,contactNumber,industry,address,websiteUrl
        })
        res.status(200).json({message:"profile updated"})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}