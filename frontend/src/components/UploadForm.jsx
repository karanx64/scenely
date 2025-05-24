// components/UploadForm.jsx
import { useState } from "react";
import PostPreview from "./PostPreview";
import getCroppedImg from "../utils/cropImage";
import axios from "axios";

export default function UploadForm() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("select");
  const [emoji, setEmoji] = useState("😐"); //new feature emoji

  const timestamp = Date.now();
  const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      setSelectedImages(images);
      setCroppedImages(new Array(images.length).fill(null));
      setCurrentIndex(0);
      setStep("crop");
    });
  };

  const handleCropComplete = async (_, croppedAreaPixels) => {
    try {
      const cropped = await getCroppedImg(
        selectedImages[currentIndex],
        croppedAreaPixels
      );

      setCroppedImages((prev) => {
        const updated = [...prev];
        updated[currentIndex] = cropped;
        return updated;
      });
    } catch (err) {
      console.error("❌ Crop error:", err);
    }
  };

  const handleCropAndContinue = () => {
    if (currentIndex < selectedImages.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (croppedImages.every(Boolean)) {
        setStep("review");
        setCurrentIndex(0);
      } else {
        alert("Please crop all images.");
      }
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const imageUrls = [];

      for (let i = 0; i < croppedImages.length; i++) {
        const img = croppedImages[i];
        const formData = new FormData();
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("file", img.file);
        formData.append("namedTransformation", "square-fit");
        // Make public_id unique per image
        formData.append("public_id", `post_${uniqueId}_${i}`);

        const res = await axios.post(
          import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
          formData
        );
        imageUrls.push(res.data.secure_url);
      }

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        { imageUrls, caption, emoji }, // new feature emoji
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = "/";
    } catch (err) {
      console.error("Post error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === "select" && (
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      )}

      {step === "crop" && selectedImages.length > 0 && (
        <>
          <PostPreview
            images={selectedImages}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            crop={crop}
            zoom={zoom}
            setCrop={setCrop}
            setZoom={setZoom}
            onCropComplete={handleCropComplete}
            mode="crop"
          />
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleCropAndContinue}
          >
            Crop and Continue
          </button>
        </>
      )}

      {step === "review" && (
        <>
          {/* new feature: emoji: <select> */}
          <select
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="🙂">🙂 Happy</option>
            <option value="😢">😢 Sad</option>
            <option value="😡">😡 Angry</option>
            <option value="😍">😍 Love</option>
            <option value="😐">😐 Neutral</option>
          </select>
          <PostPreview
            images={croppedImages.map((img) => img.preview)}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            mode="review"
          />
          <textarea
            className="w-full border rounded p-2 mt-2"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Posting..." : "Post"}
          </button>
        </>
      )}
    </div>
  );
}
