import bcrypt from "bcryptjs";
import { userModel } from "../../models/userSchema.js";
import { adminModel } from "../../models/adminSchema.js";
import { employerModel } from "../../models/employerSchema.js";
import { otpModel } from "../../models/otpModel.js";
import otpGenerator from "otp-generator"
import { sendEmail } from "../../utils/sendEmail.js";

export const userRegister = async (req, res) => {
  
   try{
    const {name,email,password,phonenumber,otp} = req.body
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
    if(!otp){
      const existinguser = await userModel.findOne({email})
      if(existinguser) return res.status(400).json({message:"user already exist"})
        await otpModel.deleteMany({email})

      const generateOtp = otpGenerator.generate(6,{
        digits:true,
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
      })
      await otpModel.create({email,otp:generateOtp})
       await sendEmail({
        to: email,
        subject: "Your Verification Code for Earnease",
        text: `Your OTP is: ${generateOtp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
            <h2 style="color: #007bff;">Earnease Account Verification</h2>
            <p style="font-size: 16px;">Thank you for registering. Please use the following code to verify your email address.</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #f2f2f2; padding: 15px 25px; border-radius: 5px; display: inline-block; margin: 20px 0;">${generateOtp}</p>
            <p style="font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      })

      return res.status(200).json({message:"otp sent succesfully"})        
    }
      const validotp = await otpModel.findOne({email,otp})
      if(!validotp) return res.status(400).json({message:"invalid otp"})
        const hashedPassword = await bcrypt.hash(password,10)
      await userModel.create({
        name,
        email,
        password:hashedPassword,
        phonenumber,
        role:"student",
        avatarUrl
      })
      await otpModel.deleteMany({email})

      return res.status(201).json({message:"user is created succesfully",})
   }
   catch(error){
    return res.status(500).json({ message: "Internal server error: "})
   }
}

export const employerRegister = async(req,res)=>{
  try{
    const{companyname,email,password,phonenumber,otp} = req.body
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyname)}&background=random&color=fff`
    if(!otp){
      const existinguser = await employerModel.findOne({email})
      if(existinguser) return res.status(404).json({message:"user already exist"})
        await otpModel.deleteMany({email})
      const generateOtp = otpGenerator.generate(6,{
        digits:true,
        lowerCaseAlphabets:false,
        specialChars:false,
        upperCaseAlphabets:false
      })
      await otpModel.create({email,otp:generateOtp})
        await sendEmail({
        to: email,
        subject: "Your Verification Code for Earnease Employer Account",
        text: `Your OTP is: ${generateOtp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
            <h2 style="color: #007bff;">Earnease Employer Verification</h2>
            <p style="font-size: 16px;">Thank you for registering your company. Use the code below to verify your email address.</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #f2f2f2; padding: 15px 25px; border-radius: 5px; display: inline-block; margin: 20px 0;">${generateOtp}</p>
            <p style="font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
        `,
      })
      return res.status(200).json({message:"otp sent successfully"})
    }
    const validotp = await otpModel.findOne({email,otp})
      if(!validotp) return res.status(400).json({message:"invalid otp"})
        const hashedPassword = await bcrypt.hash(password,10)
        const newEmployer =await employerModel.create({
        companyname,
        email,
        password:hashedPassword,
        phonenumber,
        avatarUrl,
        role:"employer",
      })
      await otpModel.deleteMany({email})

      return res.status(201).json({message:"account created succesfully",employerId: newEmployer._id})
  }
  catch(error){
    return res.status(500).json({ message: "Internal server error: " + error.message });
   }
}

export const adminRegister = async(req,res)=>{
  try{
    const {name,email,password} = req.body
    const userExist = await adminModel.findOne({email})
    if(userExist){
      return res.status(400).json({message:"user already exist"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    await adminModel.create({name,email,password:hashedPassword,role:"admin"})
    return res.status(200).json({message:"account created succesfully"})
  }
  catch(error){
    return res.status(500).json({message:"internal server error"+error.message})
  }
}