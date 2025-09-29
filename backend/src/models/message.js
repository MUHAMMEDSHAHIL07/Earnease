import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatroom",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderRole",
        required: true,
    },
    senderRole: {
        type: String,
        enum: ["employer","users"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const messageModel = mongoose.model("message", messageSchema)