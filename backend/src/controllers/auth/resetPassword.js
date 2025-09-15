import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { userModel } from "../../models/userSchema.js";
import { employerModel } from "../../models/employerSchema.js";



export const resetPassword = async(req,res)=>{
    const {token}= req.params
    const {password} = req.body

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const {id,role} = decode
        const model = role==="student"?userModel:employerModel
        const user = await model.findById(id)
        if(!user) return res.status(404).json({message:"user not found"})
            user.password= await bcrypt.hash(password,10)
            await user.save()
            return res.status(200).json({message:"password reset successfully"})
    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
}