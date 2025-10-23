import express from "express"
import { verifyEmployer } from "../controllers/employerController/verifyEmployer.js";
import { upload } from "../config/cloudinary.js";
import { deleteJob, editJob, getAllJob, getJobById, jobPost } from "../controllers/employerController/jobController.js";
import { checkRole, jwtMiddleware } from "../middleware/authMiddleware.js";
import { getStudentApplication } from "../controllers/employerController/getEmployerAppplication.js";
import { editProfile } from "../controllers/employerController/editProfile.js";
import { getProfileEmployer } from "../controllers/employerController/getProfile.js";
import { checkJobLimit } from "../middleware/checkJobPostLimit.js";
import { createJobPayment } from "../controllers/payment/createJob.js";
import { verifyPayment, verifyPaymentCompletedJob } from "../controllers/payment/verifyPayment.js";
import { getEmployerPayments } from "../controllers/payment/getEmployerPayment.js";
import { approveJobApplication, rejectJobApplication } from "../controllers/employerController/approveOrRejectApplication.js";
import { getEmployerChats, getEmployerMessageInbox } from "../controllers/employerController/employerChat.js";
import { candidateHired } from "../controllers/employerController/totalCandidate.js";
import { monthlySpending } from "../controllers/employerController/monthlySpending.js";
import { recentActivity } from "../controllers/employerController/recentActivityController.js";


const router = express.Router()

router.post("/verify", upload.single("license"),verifyEmployer)
router.post("/jobPost",jwtMiddleware,checkRole(["employer"]),jobPost)
router.get("/checkpostlimit",jwtMiddleware,checkRole(["employer"]),checkJobLimit)
router.get("/getJobs",jwtMiddleware,checkRole(["employer"]),getAllJob)
router.delete("/deleteJob/:id",jwtMiddleware,checkRole(["employer"]),deleteJob)
router.get("/getJob/:id",jwtMiddleware,checkRole(["employer"]),getJobById)
router.patch("/editjob/:id",jwtMiddleware,checkRole(["employer"]),editJob)
router.patch("/approveJob/:id",jwtMiddleware,approveJobApplication)
router.patch("/rejectJob/:id",jwtMiddleware,rejectJobApplication)
router.get("/getApplication",jwtMiddleware,checkRole(["employer"]),getStudentApplication)
router.patch("/editprofile",jwtMiddleware,checkRole(["employer"]),editProfile)
router.get("/getprofile",jwtMiddleware,checkRole(["employer"]),getProfileEmployer)
router.post("/paymentJob", jwtMiddleware, checkRole(["employer"]),createJobPayment)
router.post("/verifypayment", jwtMiddleware, checkRole(["employer"]), verifyPayment)
router.post("/verifyjobPayment/:id", jwtMiddleware, checkRole(["employer"]), verifyPaymentCompletedJob)
router.get("/getEmployerPayments", jwtMiddleware, checkRole(["employer"]), getEmployerPayments)
router.get("/chats", jwtMiddleware,checkRole(["employer"]), getEmployerChats)
router.get("/inbox", jwtMiddleware,checkRole(["employer"]), getEmployerMessageInbox)
router.get("/candidateHired", jwtMiddleware,checkRole(["employer"]), candidateHired)
router.get("/montlyPayment", jwtMiddleware,checkRole(["employer"]), monthlySpending)
router.get("/recentActivity", jwtMiddleware,checkRole(["employer"]), recentActivity)
export default router   