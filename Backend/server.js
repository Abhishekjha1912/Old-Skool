import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Create HTTP server from express app
const server = createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Save active users - optional
let users = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // User joins order room to get updates for their specific order
  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room for Order: ${orderId}`);
  });

  // Admin updates order status
  socket.on("update_order_status", ({ orderId, status }) => {
    console.log(`Status Updated: Order ${orderId} -> ${status}`);
    io.to(orderId).emit("order_status_updated", { orderId, status });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservation", reservationRoutes);

// Attach io to app (so we can use inside routes)
app.set("io", io);

app.get("/", (req, res) => {
  res.send("Old Skool Restaurant API is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
