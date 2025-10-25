import express from"express"
import { dashboardStat } from "../controllers/adminContoller/dashboardstats.js";
import { BlockUnblockStudent, getAllStudent } from "../controllers/adminContoller/studentController.js";
import { approveEmployer, getPendingVerification, getSingleVerification, rejectEmployer } from "../controllers/adminContoller/VerificationController.js";
import { BlockUnblockEmployer, getEmployer, getEmployerById } from "../controllers/adminContoller/employerController.js";
import { checkRole, jwtMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router()

router.get("/employers/pending",jwtMiddleware,checkRole(["admin"]),getPendingVerification)
router.get("/employers/pending/:id",jwtMiddleware,checkRole(["admin"]),getSingleVerification)
router.patch("/employers/approveEmployer/:id",jwtMiddleware,checkRole(["admin"]),approveEmployer)
router.patch("/employers/rejectEmployer/:id",jwtMiddleware,checkRole(["admin"]),rejectEmployer)
router.get("/getAllStudent",jwtMiddleware,checkRole(["admin"]),getAllStudent)
router.get("/getAllEmployer",jwtMiddleware,checkRole(["admin"]),getEmployer)
router.get("/getEmployer/:id",jwtMiddleware,checkRole(["admin"]),getEmployerById)
router.patch("/userStatus/:id",jwtMiddleware,checkRole(["admin"]),BlockUnblockStudent)
router.patch("/employerStatus/:id",jwtMiddleware,checkRole(["admin"]),BlockUnblockEmployer)
router.get("/dashboard-stats",jwtMiddleware,checkRole(["admin"]),dashboardStat)
router.get("/revenue-stats",jwtMiddleware,checkRole(["admin"]),dashboardStat)
export default router