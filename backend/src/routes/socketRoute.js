import express from "express";
import { jwtMiddleware } from "../middleware/authMiddleware.js";
import { getMessage } from "../socket/chatMessageController.js";
import { sendMessage } from "../socket/chatMessageController.js";

const router = express.Router()
router.get("/messages/:chatRoomId", jwtMiddleware,getMessage)
router.post("/sendMessage/:chatRoomId", jwtMiddleware,sendMessage)

export default router