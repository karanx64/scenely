import express from "express";
import { supabase } from "../config/supabase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Send a message
router.post("/", verifyToken, async (req, res) => {
  try {
    const { recipientId, text, postId } = req.body;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: req.user.id,
        recipient_id: recipientId,
        text,
        post_id: postId || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get conversation with another user
router.get("/conversation/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(id, username, avatar),
        recipient:users!messages_recipient_id_fkey(id, username, avatar),
        post:posts(id, image_urls, caption)
      `,
      )
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${currentUserId})`,
      )
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error("Fetch conversation error:", err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

// Get list of conversations (latest message per unique user)
router.get("/conversations", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(id, username, avatar),
        recipient:users!messages_recipient_id_fkey(id, username, avatar),
        post:posts(id, image_urls, caption)
      `,
      )
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Group by conversation partner
    const conversationsMap = new Map();

    data.forEach((msg) => {
      if (!msg.sender || !msg.recipient) return;

      const otherUserId =
        msg.sender.id === currentUserId ? msg.recipient.id : msg.sender.id;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, msg);
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    console.error("Fetch conversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// Delete all messages in conversation with another user
router.delete("/conversation/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const { error } = await supabase
      .from("messages")
      .delete()
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${currentUserId})`,
      );

    if (error) throw error;

    res.json({ message: "Conversation deleted" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
});

export default router;
