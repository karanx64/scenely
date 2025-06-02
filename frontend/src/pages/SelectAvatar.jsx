import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImage from "../utils/cropImage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader"; // Adjust the import based on your project structure

export default function SelectAvatar() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    setUploading(true);
    setError(null);

    try {
      // Create an HTMLImageElement from the URL
      const img = new Image();
      img.onload = async () => {
        // Get cropped image file
        const { file } = await getCroppedImage(img, croppedAreaPixels);

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        // Upload to Cloudinary
        const uploadRes = await axios.post(
          import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
          formData
        );

        const avatarUrl = uploadRes.data.secure_url;

        // Update backend user avatar
        const token = localStorage.getItem("token");
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/avatar`,
          { avatarUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/");
        setUploading(false); // Move this line here
      };
      img.onerror = (e) => {
        console.error("Error loading image:", e);
        setError("Failed to load image");
        setUploading(false);
      };
      img.src = image;
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setUploading(false);
    }
  };

  const goBackToProfile = () => {
    navigate("/profile");
  };

  if (uploading) return <Loader type="spinner" size="md" className="m-auto" />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-base-content p-4">
      <div className="bg-base-200 rounded-box shadow-md w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Choose Your Avatar</h2>

        {!image ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
        ) : (
          <div className="relative w-full h-72 bg-base-300 rounded-box">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {image && (
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="range w-full"
          />
        )}

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={!image || uploading}
          className="btn btn-primary w-full"
        >
          {uploading ? "Uploading..." : "Save and Continue"}
        </button>
        <button
          className="btn btn-error w-full"
          onClick={() => goBackToProfile()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
