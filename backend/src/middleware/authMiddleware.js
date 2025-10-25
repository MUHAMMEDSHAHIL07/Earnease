import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "../models/userSchema.js";
import { employerModel } from "../models/employerSchema.js";
import { adminModel } from "../models/adminSchema.js";
dotenv.config()

export const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    req.user= null
    return next()
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, role } = decoded

    let user;
    if (role === "student") {
      user = await userModel.findById(id).select("-password")
    } else if (role === "employer") {
      user = await employerModel.findById(id).select("-password")
    }
    else if(role ==="admin"){
      user = await adminModel.findById(id).select("-password")
    }
    
    if (!user) return res.status(404).json({ message: "User not found" })
    req.user = user    
    next()
  } catch (error) {
    return res.status(401).json({ message: error.message})
  }
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}