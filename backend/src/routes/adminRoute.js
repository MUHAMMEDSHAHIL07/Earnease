import express from"express"
import { dashboardStat } from "../controllers/adminContoller/dashboardstats.js";
import { BlockUnblockStudent, getAllStudent } from "../controllers/adminContoller/studentController.js";
import { approveEmployer, getPendingVerification, getSingleVerification, rejectEmployer } from "../controllers/adminContoller/VerificationController.js";
import { BlockUnblockEmployer, getEmployer, getEmployerById } from "../controllers/adminContoller/employerController.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router()

router.get("/employers/pending",jwtMiddleware,getPendingVerification)
router.get("/employers/pending/:id",jwtMiddleware,getSingleVerification)
router.patch("/employers/approveEmployer/:id",jwtMiddleware,approveEmployer)
router.patch("/employers/rejectEmployer/:id",jwtMiddleware,rejectEmployer)
router.get("/getAllStudent",jwtMiddleware,getAllStudent)
router.get("/getAllEmployer",jwtMiddleware,getEmployer)
router.get("/getEmployer/:id",jwtMiddleware,getEmployerById)
router.patch("/userStatus/:id",jwtMiddleware,BlockUnblockStudent)
router.patch("/employerStatus/:id",jwtMiddleware,BlockUnblockEmployer)
router.get("/dashboard-stats",jwtMiddleware,dashboardStat)
export default router