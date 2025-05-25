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

    const user = await User.findById(userId); // ✅ this was missing

    // Delete user's avatar from Cloudinary (if exists)
    if (user.avatar) {
      const url = new URL(user.avatar);
      const path = url.pathname; // e.g., /v123456789/avatar_xyz.jpg
      const publicId = path.split("/").slice(-1)[0].split(".")[0]; // extract publicId
      await cloudinary.uploader.destroy(publicId);
    }

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
// avatar
router.put("/avatar", verifyToken, async (req, res) => {
  const { avatarUrl } = req.body;
  if (!avatarUrl) {
    return res.status(400).json({ message: "Missing avatar URL" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarUrl,
        hasAvatar: true,
      },
      { new: true }
    );
    res.json({
      message: "Avatar updated",
      avatar: user.avatar,
      hasAvatar: user.hasAvatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update avatar" });
  }
});

// GET /api/users/search?name=...
router.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: "Missing search query" });

  try {
    // Case-insensitive partial match on username or name fields
    const regex = new RegExp(name, "i");
    const users = await User.find({
      $or: [{ username: regex }, { name: regex }],
    }).select("username name avatar"); // select only needed fields

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Follow a user
router.put("/follow/:userId", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userIdToFollow = req.params.userId;

    if (currentUserId === userIdToFollow) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add currentUser to followers of userToFollow if not already
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();
    }

    // Add userToFollow to following of currentUser if not already
    if (!currentUser.following.includes(userIdToFollow)) {
      currentUser.following.push(userIdToFollow);
      await currentUser.save();
    }

    res.json({ message: "User followed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Unfollow a user
router.put("/unfollow/:userId", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const userIdToUnfollow = req.params.userId;

    if (currentUserId === userIdToUnfollow) {
      return res.status(400).json({ message: "Cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove currentUser from followers of userToUnfollow
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    await userToUnfollow.save();

    // Remove userToUnfollow from following of currentUser
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow
    );
    await currentUser.save();

    res.json({ message: "User unfollowed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select(
        "-password -email" // hide sensitive info
      )
      .populate("followers", "username avatar")
      .populate("following", "username avatar");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: populate follower/following counts or send those arrays
    const followersCount = user.followers.length;
    const followingCount = user.following.length;
    const followers = user.followers;
    const following = user.following;

    res.json({
      user,
      followersCount,
      followingCount,
      followers,
      following,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:userId/followers
router.get("/:userId/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "followers",
      "username avatar"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:userId/following
router.get("/:userId/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "following",
      "username avatar"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
