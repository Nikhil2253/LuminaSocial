import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import dbConnect from "./src/config/dbConnect.js";
import userRoutes from "./src/routes/userRoutes.route.js";
import authRoutes from "./src/routes/authRoutes.route.js";
import postRoutes from "./src/routes/postRoutes.route.js";
import messageRoutes from "./src/routes/messageRoutes.route.js";
import tagRoutes from "./src/routes/tagRoutes.route.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 4001;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

dbConnect();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/tags",tagRoutes);

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((u) => u.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User connected:", userId);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const sender = getUser(senderId);
    const receiver = getUser(receiverId);
    const payload = { senderId, receiverId, text };

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", payload);
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    }

    if (sender) {
      io.to(sender.socketId).emit("getMessage", payload); 
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
