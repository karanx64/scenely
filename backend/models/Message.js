// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Optional
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
