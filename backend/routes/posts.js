import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Create post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { imageUrls, caption, tags, metadata } = req.body;

    const newPost = new Post({
      userId: req.user.id,
      imageUrls,
      caption,
      tags,
      metadata,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
});

// ✅ Get posts by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user's posts",
      error: err.message,
    });
  }
});

// ✅ Get all posts (needed for home + explore)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: err.message,
    });
  }
});

export default router;
