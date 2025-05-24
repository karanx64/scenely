import express from "express";
import Post from "../models/Post.js";
import verifyToken from "../middleware/auth.js";
// import { cloudinary } from "../utils/cloudinary.js"; // Import cloudinary for image upload

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

// DELETE a post
router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user owns the post
    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Delete post from DB
    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: "Post deleted", imageUrls: post.imageUrls });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
});

export default router;
