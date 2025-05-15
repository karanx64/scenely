import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PostPreview from "../components/PostPreview";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const [images, setImages] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const withPreview = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(withPreview);
    setCroppedImages([]);
    setShowCropper(true);
  };

  const handleCropped = (cropped) => {
    setCroppedImages(cropped);
    setShowCropper(false);
  };

  const uploadToCloudinary = async (file) => {
    const url = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error?.message || "Cloudinary upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        croppedImages.map((img) => uploadToCloudinary(img.file))
      );

      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrls: uploadedUrls,
          caption,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Post creation failed: " + errorText);
      }

      navigate("/");
    } catch (err) {
      console.error("🚨 Upload error:", err.message);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 text-text">
      <h1 className="text-xl font-bold mb-4">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <input
          type="text"
          placeholder="Caption"
          className="input input-bordered w-full"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {croppedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {croppedImages.map((img) => (
              <div key={img.id} className="w-full aspect-square bg-black">
                <img
                  src={img.preview}
                  alt="cropped"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          disabled={uploading || croppedImages.length !== images.length}
        >
          {uploading ? "Uploading..." : "Post"}
        </button>
      </form>

      {showCropper && images.length > 0 && (
        <div className="mt-4">
          <PostPreview images={images} onCropped={handleCropped} />
        </div>
      )}
    </div>
  );
}
