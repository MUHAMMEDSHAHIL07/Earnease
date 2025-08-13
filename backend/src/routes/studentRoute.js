import express from "express"
import { checkRole, jwtMiddleware } from "../middleware/authMiddleware.js"
import { updateStudentProfile } from "../controllers/studentController/updateProfile.js"
import {  getAllJobs } from "../controllers/studentController/lisJob.js"
import { applyJob } from "../controllers/studentController/jobApplication.js"
import { getStudentJobList } from "../controllers/studentController/getAppliedJob.js"

const router = express.Router()

router.patch("/profile",jwtMiddleware,checkRole(["student"]),updateStudentProfile)
router.get("/getAllJobs",getAllJobs)
router.get("/applications",jwtMiddleware,checkRole(["student"]),getStudentJobList)
router.post("/applyJob/:id",jwtMiddleware,checkRole(["student"]),applyJob)

export default router