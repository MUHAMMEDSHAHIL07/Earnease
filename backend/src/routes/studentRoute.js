import express from "express"
import { checkRole, jwtMiddleware } from "../middleware/authMiddleware.js"
import { updateStudentProfile } from "../controllers/studentController/updateProfile.js"
import {  getAllJobs, getJobById } from "../controllers/studentController/lisJob.js"
import { applyJob } from "../controllers/studentController/jobApplication.js"
import { getStudentJobList } from "../controllers/studentController/getAppliedJob.js"
import { deleteSavedJob, getSavedJob, postSavedJob } from "../controllers/studentController/savedJob.js"
import { getStudentChats, getStudentMessageInbox } from "../controllers/studentController/studentChat.js"
import { uploadStudent } from "../config/cloudinary.js"
import { getProfileStudent } from "../controllers/studentController/getProfile.js"
import { myApplication } from "../controllers/studentController/myApplications.js"


const router = express.Router()

router.patch("/editprofile",jwtMiddleware,checkRole(["student"]),uploadStudent.single("avatarUrl"),updateStudentProfile)
router.get("/getAllJobs",getAllJobs)
router.get("/getJob/:id",getJobById)
router.get("/getProfile",jwtMiddleware,checkRole(["student"]),getProfileStudent)
router.get("/applications",jwtMiddleware,checkRole(["student"]),getStudentJobList)
router.post("/applyJob/:id",jwtMiddleware,checkRole(["student"]),applyJob)
router.post("/saveJob",jwtMiddleware,checkRole(["student"]),postSavedJob)
router.get("/getSavedJob",jwtMiddleware,checkRole(["student"]),getSavedJob)
router.delete("/removeSavedJob/:id",jwtMiddleware,checkRole(["student"]),deleteSavedJob)
router.get("/myapplications", jwtMiddleware,checkRole(["student"]), myApplication)
router.get("/inbox",jwtMiddleware,checkRole(["student"]),getStudentMessageInbox)
router.get("/chats",jwtMiddleware,checkRole(["student"]),getStudentChats)
export default router