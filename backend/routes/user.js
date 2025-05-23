// routes/user.js
import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import verifyToken from "../middleware/auth.js";
import { cloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// DELETE /api/users/me - Delete user and their posts
router.delete("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ userId });

    // Delete Cloudinary images for each post
    for (const post of posts) {
      for (const url of post.imageUrls) {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete posts
    await Post.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account and all posts deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

export default router;
