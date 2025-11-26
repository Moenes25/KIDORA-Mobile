import express from "express";
import  { Server } from "socket.io";
import  http from "http";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import profilesRouter from "./routes/profiles.js";
import blogRouter from "./routes/blog.js";
import profileRoutes from "./routes/profileRoutes.js";
import  dailyRecordRoutes  from "./routes/dailyRecordRoutes.js";



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
//app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- Optional

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // lock this down in production
    methods: ["GET", "POST"]
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profiles", profilesRouter);
app.use("/api/blog", blogRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/daily-records", dailyRecordRoutes);


// In-memory storage (replace with DB for production)
const messages = []; // { text, sender, at, room? }

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const msg = req.body;
  messages.push(msg);
  res.status(201).json(msg);
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    // send room history
    const roomHistory = messages.filter(m => m.room === room || (!m.room && room === "parental-room"));
    socket.emit("history", roomHistory);
  });

  socket.on("message", (msg) => {
    // optionally attach server timestamp
    msg.at = msg.at || new Date().toISOString();
    messages.push(msg);
    // broadcast to everyone (or to room)
    if (msg.room) {
      io.to(msg.room).emit("message", msg);
    } else {
      io.emit("message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
