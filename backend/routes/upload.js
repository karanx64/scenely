import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
import verifyToken from "../middleware/auth.js";

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

export default router;
