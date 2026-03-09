import express from "express";
import { supabase } from "../config/supabase.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Create post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { imageUrls, caption, tags, metadata, emoji, media } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: req.user.id,
        image_urls: imageUrls,
        caption,
        emoji,
        tags,
        metadata,
        media,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Create post error:", err);
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
});

// Get posts by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        users!posts_user_id_fkey (
          id,
          username,
          avatar
        )
      `,
      )
      .eq("user_id", req.params.userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Fetch user posts error:", err);
    res.status(500).json({
      message: "Failed to fetch user's posts",
      error: err.message,
    });
  }
});

// Get all posts (for home + explore)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        users!posts_user_id_fkey (
          id,
          username,
          avatar
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({
      message: "Failed to fetch posts",
      error: err.message,
    });
  }
});

// DELETE a post
router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    // First, get the post to check ownership and get image URLs
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", req.params.postId)
      .single();

    if (fetchError) throw fetchError;
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user owns the post
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete post from DB (likes, views cascade automatically)
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", req.params.postId);

    if (deleteError) throw deleteError;

    res.json({ message: "Post deleted", imageUrls: post.image_urls });
  } catch (err) {
    console.error("Delete post error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
});

// LIKE a post
router.post("/:postId/like", verifyToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (existingLike) {
      // Unlike: delete the like
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      // Like: insert new like
      const { error } = await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: userId });

      if (error) throw error;
    }

    // Get updated like count
    const { count, error: countError } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (countError) throw countError;

    res.json({ likes: count });
  } catch (err) {
    console.error("Like post error:", err);
    res
      .status(500)
      .json({ message: "Failed to like post", error: err.message });
  }
});

// TRACK VIEW
router.post("/:postId/view", async (req, res) => {
  try {
    const { viewerId } = req.body;
    const postId = req.params.postId;

    // Check if already viewed
    const { data: existingView } = await supabase
      .from("views")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", viewerId)
      .single();

    if (!existingView) {
      // Insert new view
      const { error } = await supabase
        .from("views")
        .insert({ post_id: postId, user_id: viewerId });

      if (error) throw error;
    }

    // Get updated view count
    const { count, error: countError } = await supabase
      .from("views")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (countError) throw countError;

    res.json({ views: count });
  } catch (err) {
    console.error("Track view error:", err);
    res
      .status(500)
      .json({ message: "Failed to track view", error: err.message });
  }
});

export default router;
