import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Missing search query" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar")
      .or(`username.ilike.%${name}%,name.ilike.%${name}%`)
      .limit(20);

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
