import { Server } from "socket.io";
import { chatRoomModel } from "../models/chatRoom.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173","https://earnease-portal.vercel.app/"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    if (!token) return next(new Error("No token"));
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next()
    } catch (err) {
      next(new Error("Auth failed"));
    }
  })

  io.on("connection", (socket) => {
    console.log("New user connected", socket.id)

    socket.on("joinRoom", async (chatRoomId) => {
      const chatRoom = await chatRoomModel.findById(chatRoomId).populate("jobApplication");
      if (!chatRoom) return

      if (chatRoom.jobApplication.status !== "accepted") {
        console.log("Chat not allowed, application not accepted");
        return
      }

      if (
        String(chatRoom.student) !== socket.user.id &&
        String(chatRoom.employer) !== socket.user.id
      ) {
        console.log("Unauthorized join attempt");
        return
      }
      socket.join(chatRoomId)
    })

    socket.on("sendMessage", ({ chatRoomId, message }) => {
      io.to(chatRoomId).emit("receiveMessage", message);
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    })
  })

  return io
}