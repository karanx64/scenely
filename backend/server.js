import "./config/env.js";
import express from "express";
import cors from "cors";

import postsSupabaseRoutes from "./routes/posts-supabase.js";
import messagesSupabaseRoutes from "./routes/messages-supabase.js";
import usersSupabaseRoutes from "./routes/users-supabase.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Scenely API is running");
});

app.use("/api/posts-supabase", postsSupabaseRoutes);
app.use("/api/messages-supabase", messagesSupabaseRoutes);
app.use("/api/users-supabase", usersSupabaseRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
