import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
import verifyToken from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";

const upload = multer({ storage });
const router = express.Router();

// Upload image
router.post("/", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.status(200).json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

// POST /api/upload/cloudinary-delete
router.post("/cloudinary-delete", verifyToken, async (req, res) => {
  const { publicId } = req.body;
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cloudinary delete failed", error: err.message });
  }
});

export default router;
