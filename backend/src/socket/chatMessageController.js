import { messageModel } from "../models/message.js";
import { chatRoomModel } from "../models/chatRoom.js";
import mongoose from "mongoose";

let io;
export const setSocketIO = (ioInstance) => {
    io = ioInstance;
};

export const getMessage = async (req, res) => {
    const { chatRoomId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
        return res.status(400).json({ message: 'Invalid chat room ID format' });
    } 
    try {
        const chatRoom = await chatRoomModel.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (
            String(chatRoom.student) !== req.user.id &&
            String(chatRoom.employer) !== req.user.id
        ) {
            return res.status(403).json({ message: "Not authorized to access this chat" });
        }
        const messages = await messageModel
            .find({ chatRoom: chatRoomId })
            .populate("sender", "name avatarUrl")
            .sort({ createdAt: 1 });

        res.json({ success: true, data: messages });
    } catch (err) {
        console.error("Error in getMessage controller:", err);
        res.status(500).json(err.message);
    }
};

export const sendMessage = async (req, res) => {
    const { text } = req.body;
    const chatRoomId = req.params.chatRoomId;

    if (!text) return res.status(400).json({ message: "Message text is required" });

    try {
        const newMessage = await messageModel.create({
            chatRoom: chatRoomId,
            sender: req.user.id,
            senderRole: req.user.role,
            text,
        })
        const populatedMessage = await newMessage.populate("sender", "name avatarUrl")
        if (io) {
            io.to(chatRoomId).emit("receiveMessage", populatedMessage);
        }

        res.json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}