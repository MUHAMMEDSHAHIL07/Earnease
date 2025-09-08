import { chatRoomModel } from "../../models/chatRoom.js"
import { messageModel } from "../../models/message.js"

export const getStudentChats = async (req, res) => {
    try {
        const studentId = req.user.id
        const chats = await chatRoomModel.find({ student: studentId })
            .populate("employer", "companyname avatarUrl")
            .sort({ updatedAt: -1 })
        res.json({ success: true, data: chats })
    }
    catch (err) {
        res.status(500).json({ success: true, message: err.message })
    }
}

export const getStudentMessageInbox = async (req, res) => {
    try {
        const studentId = req.user.id
        const studentChatRooms = await chatRoomModel.find({ student: studentId })
        const studentChatRoomsIds = studentChatRooms.map(room => room._id)
        if (studentChatRoomsIds.length === 0) {
            return res.json({ success: true, message: "no chat yet", chatRooms: [] })
        }
        const activeChatRoomIds = await messageModel.distinct("chatRoom", {
            chatRoom: { $in: studentChatRoomsIds }
        })
        if (activeChatRoomIds.length === 0) {
            return res.json({ success: true, message: "no chat yet", chatRooms: [] })
        }
        const inboxChatRooms = await chatRoomModel.find({ _id: { $in: activeChatRoomIds } })
            .populate("employer", "companyname avatarUrl")
            .populate({
                path: "jobApplication",
                populate: { path: "job", select: "title" }
            })
            .lean()
        for (const room of inboxChatRooms) {
            const lastMessage = await messageModel
                .findOne({ chatRoom: room._id })
                .sort({ createdAt: -1 })
                .lean();

            room.lastMessage = lastMessage?.text || ""
            room.lastMessageTime = lastMessage?.createdAt?.toISOString() || null;

            const unreadCount = await messageModel.countDocuments({
                chatRoom: room._id,
                sender: { $ne: studentId },
            })

            room.unreadCount = unreadCount || 0;
        }
         return res.json({ success: true, chatRooms: inboxChatRooms });

    }
    catch (error) {
        console.error("Error fetching student inbox:", error);
        res.status(500).json({ success: false, message: "internal server error" });
    }
}