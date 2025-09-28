import { Server } from "socket.io";
import { chatRoomModel } from "../models/chatRoom.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function initSocket(server) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://earnease-portal.vercel.app"
  ];

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
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
    console.log("New user connected", socket.id);

    socket.on("joinRoom", async (chatRoomId) => {
      try {
        const chatRoom = await chatRoomModel.findById(chatRoomId).populate("jobApplication");
        if (!chatRoom) {
          console.log(`Attempt to join non-existent room: ${chatRoomId}`);
          return;
        }

        if (!chatRoom.jobApplication || chatRoom.jobApplication.status !== "accepted") {
          console.log(`Chat not allowed for room ${chatRoomId}: Application not found or not accepted.`);
          return;
        }

        if (
          String(chatRoom.student) !== socket.user.id &&
          String(chatRoom.employer) !== socket.user.id
        ) {
          console.log(`Unauthorized join attempt by user ${socket.user.id} for room ${chatRoomId}`);
          return;
        }
        socket.join(chatRoomId);
        console.log(`User ${socket.id} successfully joined room ${chatRoomId}`);
      } catch (error) {
        console.error(`Error in joinRoom handler for room ${chatRoomId}:`, error);
      }
    });

    socket.on("sendMessage", ({ chatRoomId, message }) => {
      if (chatRoomId && message) {
        io.to(chatRoomId).emit("receiveMessage", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io
}