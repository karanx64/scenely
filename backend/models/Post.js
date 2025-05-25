// models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrls: [{ type: String, required: true }], // changed from imageUrl
    caption: { type: String },
    //new features: emoji, likes, views
    emoji: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: [{ type: String }],
    tags: [String],
    metadata: { type: Object },
    media: {
      title: { type: String },
      type: { type: String }, // e.g., 'movie' or 'tv'
      tmdbId: { type: String }, // optional
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
