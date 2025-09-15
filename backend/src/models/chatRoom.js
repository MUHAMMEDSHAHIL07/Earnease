import mongoose from "mongoose";
const chatRoomSchema = new mongoose.Schema({
    jobApplication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobapplication",
        required: true
    },
    employer: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "employer",
         required: true
     },
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true
     },
    isActive: { 
        type: Boolean, 
        default: false
     },
},{ timestamps: true })
chatRoomSchema.index({ jobApplication: 1 }, { unique: true });
export const chatRoomModel = mongoose.model("chatroom",chatRoomSchema)