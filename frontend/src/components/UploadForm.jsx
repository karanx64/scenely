import { useState } from "react";
import PostPreview from "./PostPreview"; // Ensure path is correct

export default function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });
    setSelectedFiles(filesWithPreview);
  };

  const handleCropped = (cropped) => {
    console.log("✅ Cropped images:", cropped);
    setCroppedImages(cropped); // You can send these to Cloudinary later
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {selectedFiles.length > 0 && (
        <PostPreview images={selectedFiles} onCropped={handleCropped} />
      )}

      {croppedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {croppedImages.map((img) => (
            <div key={img.id} className="w-full aspect-square bg-black">
              <img
                src={URL.createObjectURL(img.file)}
                alt="cropped"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
