import { useState } from "react";
import fileToDataUrl from "../utils/convertToDataUrl";

export default function TestFileReader() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("🧾 Selected file:", file);

    try {
      const preview = await fileToDataUrl(file);
      console.log("🔍 Preview from fileToDataUrl:", preview);
      setImagePreview(preview);
    } catch (err) {
      console.error("❌ Failed to convert file:", err);
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Test FileReader</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-4 w-64 h-64 object-contain bg-black"
        />
      )}
    </div>
  );
}
