import dotenv from "dotenv";
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
import { apiLimiter } from "./middleware/rateLimit.js";

// Load environment variables before anything uses them
dotenv.config();
const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "https://earnease-portal.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json())
app.use(cookieParser()) 
app.use("/api/auth", authRoute)
app.use("/api/student",studentRoute)
app.use("/api/employer",employerRoute)
app.use("/api/admin",adminRouter)
app.use("/api/chat",SocketRoute)
app.use(apiLimiter)
const io = initSocket(server)
chatMessageController.setSocketIO(io);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
