import { chatRoomModel } from "../../models/chatRoom.js";
import { messageModel } from "../../models/message.js";


export const getEmployerChats = async (req, res) => {
    try {
        const employerId = req.user.id;
        const chats = await chatRoomModel
            .find({ employer: employerId })
            .populate("student", "name avatarUrl")
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getEmployerMessageInbox = async (req, res) => {
    try {
        const employerId = req.user.id
        const employerChatRooms = await chatRoomModel.find({ employer: employerId })
        const employerChatRoomIds = employerChatRooms.map(room => room._id)
        if (employerChatRoomIds.length === 0) {
            return res.json({ success: true, message: "no chat yet", chatRooms: [] })
        }
        const activeChatRoomIds = await messageModel.distinct("chatRoom", {
            chatRoom: { $in: employerChatRoomIds }
        })
        if (activeChatRoomIds.length === 0) {
            return res.json({ success: true, message: "no chat yet", chatRooms: [] })
        }
        const inboxChatRooms = await chatRoomModel.find({ _id: { $in: activeChatRoomIds } })
            .populate("student", "name avatarUrl email")
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

            room.lastMessage = lastMessage?.text || "";
            room.lastMessageTime = lastMessage?.createdAt?.toISOString() || null;

            const unreadCount = await messageModel.countDocuments({
                chatRoom: room._id,
                sender: { $ne: employerId },
                readByEmployer: { $ne: true },
            });

            room.unreadCount = unreadCount || 0;
        }
        res.json({ success: true, chatRooms: inboxChatRooms })
    }
    catch (error) {
        console.error("Error fetching employer inbox:", error);
        res.status(500).json({ success: false, message: "internal server error" });
    }
}