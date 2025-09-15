import express from "express";
import { adminRegister, employerRegister, userRegister } from "../controllers/auth/userRegister.js";
import { adminLogin, userLogin } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { forgetPassword } from "../controllers/auth/forgetPassword.js";
import { resetPassword } from "../controllers/auth/resetPassword.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { GoogleLogin } from "../controllers/auth/googleAuth.js";
import { me } from "../controllers/public/me.js";
import { checkBlocked } from "../middleware/checkBlock.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/userregister",checkBlocked, userRegister);
router.post("/employerregister", checkBlocked,employerRegister);
router.post("/adminregister",checkBlocked, adminRegister);
router.post("/login",checkBlocked,userLogin)
router.post("/adminlogin",checkBlocked,adminLogin)
router.post("/forgot-password",checkBlocked,loginLimiter,forgetPassword)
router.post('/googlelogin',checkBlocked,GoogleLogin);
router.post("/reset-password/:token", checkBlocked,loginLimiter,resetPassword);
router.delete("/logout",logout)
router.get("/me",jwtMiddleware,me)
export default router;