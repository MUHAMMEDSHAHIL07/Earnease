import jwt from "jsonwebtoken"
import { adminModel } from "../models/adminSchema.js"

export const adminProtect = async(req,res,next)=>{
    try{
        const token = req.cookies.token
        if(!token)return res.status(401).json({message:"not token provided"})
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            const admin = await adminModel.findById(decode.id)
            if(!admin) return res.status(401).json({message:"not a admin"})
                req.admin = admin
            next()
    }
    catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}   