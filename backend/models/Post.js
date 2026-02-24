import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrls: [{ type: String, required: true }],
    caption: { type: String },
    emoji: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: [{ type: String }],
    tags: [String],
    metadata: { type: Object },
    media: {
      title: { type: String },
      type: { type: String },
      tmdbId: { type: String },
      year: { type: String },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", PostSchema);
