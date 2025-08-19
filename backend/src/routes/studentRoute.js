import express from "express"
import { checkRole, jwtMiddleware } from "../middleware/authMiddleware.js"
import { updateStudentProfile } from "../controllers/studentController/updateProfile.js"
import {  getAllJobs, getJobById } from "../controllers/studentController/lisJob.js"
import { applyJob } from "../controllers/studentController/jobApplication.js"
import { getStudentJobList } from "../controllers/studentController/getAppliedJob.js"
import { deleteSavedJob, getSavedJob, postSavedJob } from "../controllers/studentController/savedJob.js"

const router = express.Router()

router.patch("/profile",jwtMiddleware,checkRole(["student"]),updateStudentProfile)
router.get("/getAllJobs",getAllJobs)
router.get("/getJob/:id",getJobById)
router.get("/applications",jwtMiddleware,checkRole(["student"]),getStudentJobList)
router.post("/applyJob/:id",jwtMiddleware,checkRole(["student"]),applyJob)
router.post("/saveJob",jwtMiddleware,checkRole(["student"]),postSavedJob)
router.get("/getSavedJob",jwtMiddleware,checkRole(["student"]),getSavedJob)
router.delete("/removeSavedJob/:id",jwtMiddleware,checkRole(["student"]),deleteSavedJob)
export default router