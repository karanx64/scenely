import "./config/env.js"; // Correct the path here

//test_branch check

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import uploadRoutes from "./routes/upload.js";
import userRoutes from "./routes/user.js";
import messageRoutes from "./routes/message.js";

const app = express();
app.use(cors());
app.use(express.json());

// Simple API test route
app.get("/", (req, res) => {
  res.send("Scenely API is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Routes

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/messages", messageRoutes);
