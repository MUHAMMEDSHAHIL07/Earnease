import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "../../models/userSchema.js";
import { employerModel } from "../../models/employerSchema.js";
import { adminModel } from "../../models/adminSchema.js";
import EmployerVerification from "../../models/employerVerifiySchema.js";
dotenv.config()

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await userModel.findOne({ email })
        let role = "student"
        if (!user) {
            user = await employerModel.findOne({ email })
            role = "employer"
        }
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked by admin." });
        }
        if (!user.password) {
            return res.status(404).json({ message: "this account is created using google.Please login with google" })
        }
        const passwordmatch = await bcrypt.compare(password, user.password)
        if (!passwordmatch) {
            return res.status(401).json({ message: "invalid password" })
        }
        if (role === "employer" && !user.isVerified) {
            const existingVerification = await EmployerVerification.findOne({ employerId: user._id })
            if (!existingVerification) {
                return res.status(401).json({ status: "incomplete", message: "please complete your verification from", employerId: user._id, role: "employer" })
            }
            else {
                return res.status(403).json({ status: "pending", message: "your account is under verification" })
            }
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "login successfully",
            role,
            employerId: user._id,
            user: {
                name: user.name || user.companyname,
                avatarUrl: user.avatarUrl,
            }
        })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admincheck = await adminModel.findOne({ email: email, role: "admin" })
        if (!admincheck) return res.status(400).json({ message: "not a admin" })
        const passwordmatch = await bcrypt.compare(password, admincheck.password)
        if (!passwordmatch) return res.status(401).json({ message: "invalid password" })
        const token = jwt.sign({ id: admincheck._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000
        })
        res.status(200).json({
            message: "login succesfully",
            user: {
                name: admincheck.name || "Admin",
                avatarUrl: admincheck.avatarUrl || null,
                role: "admin"
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" + error.message })
    }
}