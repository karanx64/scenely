// // src/pages/SelectAvatar.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function SelectAvatar() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setUploading(true);
//     setError(null);

//     try {
//       // 1. Upload to Cloudinary
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append(
//         "upload_preset",
//         import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
//       );

//       const uploadRes = await axios.post(
//         import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
//         formData
//       );

//       const avatarUrl = uploadRes.data.secure_url;

//       // 2. Update user on backend
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${import.meta.env.VITE_API_URL}/users/avatar`,
//         { avatarUrl },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // 3. Navigate to home
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload avatar");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-bg text-text">
//       <div className="p-6 bg-white rounded shadow-md w-96 space-y-4 text-center">
//         <h2 className="text-xl font-bold">Choose Your Avatar</h2>

//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         {file && (
//           <img
//             src={URL.createObjectURL(file)}
//             alt="Preview"
//             className="h-32 w-32 rounded-full object-cover mx-auto"
//           />
//         )}

//         {error && <p className="text-red-500">{error}</p>}

//         <button
//           onClick={handleUpload}
//           className="btn btn-primary w-full"
//           disabled={uploading || !file}
//         >
//           {uploading ? "Uploading..." : "Save and Continue"}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImage from "../utils/cropImage"; // helper to get cropped blob
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SelectAvatar() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    setUploading(true);
    setError(null);

    try {
      // Get cropped image blob
      const croppedBlob = await getCroppedImage(image, croppedAreaPixels);

      const formData = new FormData();
      formData.append("file", croppedBlob.file);
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
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

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
      </div>
    </div>
  );
}
