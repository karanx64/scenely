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
    tags: [String],
    metadata: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
