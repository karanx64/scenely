// /routes/message.js
import express from "express";
import verifyToken from "../middleware/auth.js";
import Message from "../models/Message.js";
import Post from "../models/Post.js";

const router = express.Router();

// Send a message (with optional postId)
router.post("/", verifyToken, async (req, res) => {
  const { recipientId, text, postId } = req.body;
  try {
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      text,
      post: postId || null,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get conversation with another user
router.get("/conversation/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username avatar")
      .populate("post");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

// Get list of conversations (latest message per unique user)
router.get("/conversations", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username avatar")
      .populate("recipient", "username avatar")
      .populate("post");

    const uniqueConversations = new Map();
    messages.forEach((msg) => {
      // Defensive: skip if sender or recipient is missing
      if (!msg.sender || !msg.recipient) return;
      const otherUserId =
        msg.sender._id.toString() === req.user.id
          ? msg.recipient._id.toString()
          : msg.sender._id.toString();

      if (!uniqueConversations.has(otherUserId)) {
        uniqueConversations.set(otherUserId, msg);
      }
    });

    res.json(Array.from(uniqueConversations.values()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// Delete all messages in conversation with another user
router.delete("/conversation/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    await Message.deleteMany({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id },
      ],
    });
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete conversation" });
  }
});

export default router;
