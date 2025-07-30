import { userModel } from "../../models/userSchema.js"

export const updateStudentProfile = async(req,res)=>{
    try{
        const userId = req.user.id
        const update = req.body
        
        const updatedUser = await userModel.findByIdAndUpdate(userId,update,{
            new:true
        })
        res.status(200).json({
            message:"profile updated succesfully",
            updatedProfile:updatedUser
        })
    }
    catch(error){
        return res.status(500).json({message:"error"+error.message})
    }
}