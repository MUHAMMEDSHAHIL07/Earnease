import { userModel } from "../../models/userSchema.js"

export const getProfileStudent = async(req,res)=>{
    try{
        const studentId = req.user.id
        const student = await userModel.findById(studentId)
        if(!student){
            return res.status(404).json({message:"no student found"})
        }
        res.status(200).json({
            student
        })
    }
    catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}