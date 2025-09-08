import express from "express";
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoutes.js"; 
import http from "http";
import studentRoute from "./routes/studentRoute.js"
import adminRouter from "./routes/adminRoute.js"
import employerRoute from "./routes/employerRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import initSocket from "./socket/index.js";
import SocketRoute from "./routes/socketRoute.js"
import * as chatMessageController from './socket/chatMessageController.js'
// import { apiLimiter } from "./middleware/rateLimit.js";
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors({
  origin:"http://localhost:5173",credentials: true
}))

app.use(express.json())
app.use(cookieParser()) 
app.use("/api/auth", authRoute)
app.use("/api/student",studentRoute)
app.use("/api/employer",employerRoute)
app.use("/admin",adminRouter)
app.use("/api/chat",SocketRoute)
// app.use(apiLimiter)
const io = initSocket(server)
chatMessageController.setSocketIO(io);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})