import "../config/env.js"; // 👈 Load env early
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "scenely",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 720, height: 720, crop: "limit", quality: "auto" }, // size constraint + compression
    ],
  },
});

export { cloudinary, storage };
