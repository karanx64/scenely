// // components/UploadForm.jsx
// import { useState } from "react";
// import PostPreview from "./PostPreview";
// import getCroppedImg from "../utils/cropImage";
// import axios from "axios";
// import MovieSearch from "./MovieSearch";

// export default function UploadForm() {
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [croppedImages, setCroppedImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [caption, setCaption] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [step, setStep] = useState("select");
//   const [emoji, setEmoji] = useState("😐"); //new feature emoji

//   // const [mediaResults, setMediaResults] = useState([]);

//   // const [media, setMedia] = useState({
//   //   title: "",
//   //   tmdbId: "",
//   //   type: "", // "movie" or "tv"
//   // });

//   const [media, setMedia] = useState({
//     title: "",
//     tmdbId: "",
//     type: "",
//   });

//   const timestamp = Date.now();
//   const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;

//   // const handleMediaSearch = async (title) => {
//   //   setMedia((prev) => ({ ...prev, title }));
//   //   if (title.length < 2) return;

//   //   try {
//   //     const res = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
//   //       params: {
//   //         query: title,
//   //         include_adult: false,
//   //         language: "en-US",
//   //         page: 1,
//   //       },
//   //       headers: {
//   //         accept: "application/json",
//   //         Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`,
//   //       },
//   //     });

//   //     const results = res.data.results
//   //       .filter(
//   //         (item) => item.media_type === "movie" || item.media_type === "tv"
//   //       )
//   //       .slice(0, 5);

//   //     setMediaResults(results);
//   //   } catch (err) {
//   //     console.error("TMDB search error:", err);
//   //   }
//   // };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const readers = files.map(
//       (file) =>
//         new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.readAsDataURL(file);
//         })
//     );

//     Promise.all(readers).then((images) => {
//       setSelectedImages(images);
//       setCroppedImages(new Array(images.length).fill(null));
//       setCurrentIndex(0);
//       setStep("crop");
//     });
//   };

//   const handleCropComplete = async (_, croppedAreaPixels) => {
//     try {
//       const cropped = await getCroppedImg(
//         selectedImages[currentIndex],
//         croppedAreaPixels
//       );

//       setCroppedImages((prev) => {
//         const updated = [...prev];
//         updated[currentIndex] = cropped;
//         return updated;
//       });
//     } catch (err) {
//       console.error("❌ Crop error:", err);
//     }
//   };

//   const handleCropAndContinue = () => {
//     if (currentIndex < selectedImages.length - 1) {
//       setCurrentIndex((i) => i + 1);
//     } else {
//       if (croppedImages.every(Boolean)) {
//         setStep("review");
//         setCurrentIndex(0);
//       } else {
//         alert("Please crop all images.");
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     setUploading(true);
//     try {
//       const imageUrls = [];

//       for (let i = 0; i < croppedImages.length; i++) {
//         const img = croppedImages[i];
//         const formData = new FormData();
//         formData.append(
//           "upload_preset",
//           import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
//         );
//         formData.append("file", img.file);
//         formData.append("namedTransformation", "square-fit");
//         // Make public_id unique per image
//         formData.append("public_id", `post_${uniqueId}_${i}`);

//         const res = await axios.post(
//           import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
//           formData
//         );
//         imageUrls.push(res.data.secure_url);
//       }

//       const token = localStorage.getItem("token");

//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/posts`,
//         { imageUrls, caption, emoji, media }, // new feature emoji
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       window.location.href = "/";
//     } catch (err) {
//       console.error("Post error:", err);
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       {step === "select" && (
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       )}

//       {step === "crop" && selectedImages.length > 0 && (
//         <>
//           <PostPreview
//             images={selectedImages}
//             currentIndex={currentIndex}
//             setCurrentIndex={setCurrentIndex}
//             crop={crop}
//             zoom={zoom}
//             setCrop={setCrop}
//             setZoom={setZoom}
//             onCropComplete={handleCropComplete}
//             mode="crop"
//           />
//           <button
//             className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
//             onClick={handleCropAndContinue}
//           >
//             Crop and Continue
//           </button>
//         </>
//       )}

//       {step === "review" && (
//         <>
//           <PostPreview
//             images={croppedImages.map((img) => img.preview)}
//             currentIndex={currentIndex}
//             setCurrentIndex={setCurrentIndex}
//             mode="review"
//           />

//           {/* <input
//             type="text"
//             value={media.title}
//             onChange={(e) => handleMediaSearch(e.target.value)}
//             placeholder="Enter movie or series name"
//             className="input input-bordered w-full"
//           />
//           {mediaResults.length > 0 && (
//             <ul className="bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow">
//               {mediaResults.map((item) => (
//                 <li
//                   key={item.id}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => {
//                     setMedia({
//                       title: item.title || item.name,
//                       tmdbId: item.id,
//                       type: item.media_type,
//                     });
//                     setMediaResults([]);
//                   }}
//                 >
//                   {item.title || item.name} ({item.media_type})
//                 </li>
//               ))}
//             </ul>
//           )} */}

//           <MovieSearch media={media} setMedia={setMedia} />

//           <textarea
//             className="w-full border rounded p-2 mt-2"
//             placeholder="Write a caption..."
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//           />
//           {/* new feature: emoji: <select> */}
//           <select
//             value={emoji}
//             onChange={(e) => setEmoji(e.target.value)}
//             className="input input-bordered w-full"
//           >
//             <option value="🙂">🙂 Happy</option>
//             <option value="😢">😢 Sad</option>
//             <option value="😡">😡 Angry</option>
//             <option value="😍">😍 Love</option>
//             <option value="😐">😐 Neutral</option>
//           </select>

//           <button
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full"
//             onClick={handleSubmit}
//             disabled={uploading}
//           >
//             {uploading ? "Posting..." : "Post"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import PostPreview from "./PostPreview";
import getCroppedImg from "../utils/cropImage";
import axios from "axios";
import MovieSearch from "./MovieSearch";

export default function UploadForm() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState({
    // aspect: 1,
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("select");
  const [emoji, setEmoji] = useState("😐");

  const [media, setMedia] = useState({
    title: "",
    tmdbId: "",
    type: "",
  });

  const timestamp = Date.now();
  const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;

  const onImageLoaded = (img) => {
    console.log("Image loaded in UploadForm:", img);
    setImageRef(img);
    const width = 80;
    const height = 80;
    setCrop((prevCrop) => ({
      ...prevCrop,
      width,
      height,
      x: (100 - width) / 2,
      y: (100 - height) / 2,
    }));
    return false;
  };

  const handleCropComplete = (c) => {
    console.log("Crop complete in UploadForm:", c);
    if (c.width && c.height) {
      setCompletedCrop(c);
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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
      console.log("Selected images loaded:", images);
      setCroppedImages(new Array(images.length).fill(null));
      setCurrentIndex(0);
      setImageRef(null);
      setCompletedCrop(null);
      setCrop({
        aspect: 1,
        unit: "%",
        width: 80,
        height: 80,
        x: 10,
        y: 10,
      });
      setStep("crop");
    });
  };

  const handleCropAndContinue = async () => {
    if (!completedCrop || !imageRef) {
      console.log("Missing crop or imageRef:", { completedCrop, imageRef });
      return;
    }
    try {
      const cropped = await getCroppedImg(imageRef, completedCrop);
      console.log("Successfully cropped image:", cropped);
      setCroppedImages((prev) => {
        const updated = [...prev];
        updated[currentIndex] = cropped;
        return updated;
      });
      if (currentIndex < selectedImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCrop({
          aspect: 1,
          unit: "%",
          width: 80,
          height: 80,
          x: 10,
          y: 10,
        });
      } else {
        setStep("review");
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Failed to crop image:", err);
      alert("Failed to crop image. Please try again.");
    }
  };

  const handlePrev = () => {
    setCurrentIndex((i) => (i === 0 ? selectedImages.length - 1 : i - 1));
    setCrop({
      aspect: 1,
      unit: "%",
      width: 80,
      height: 80,
      x: 10,
      y: 10,
    });
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i === selectedImages.length - 1 ? 0 : i + 1));
    setCrop({
      aspect: 1,
      unit: "%",
      width: 80,
      height: 80,
      x: 10,
      y: 10,
    });
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
        // formData.append("namedTransformation", "square-fit");
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
        { imageUrls, caption, emoji, media },
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
          onChange={handleFiles}
          className="file-input file-input-bordered w-full"
        />
      )}

      {step === "crop" && selectedImages.length > 0 && (
        <div className="space-y-4">
          <PostPreview
            images={selectedImages}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            crop={crop}
            setCrop={setCrop}
            onCropComplete={handleCropComplete}
            onImageLoaded={onImageLoaded}
            mode="crop"
          />
          <div className="flex gap-2">
            <button className="btn btn-neutral" onClick={handlePrev}>
              Previous
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={handleCropAndContinue}
            >
              {currentIndex < selectedImages.length - 1 ? "Next" : "Continue"}
            </button>
            <button className="btn btn-neutral" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <PostPreview
            images={croppedImages.map((img) => img.preview)}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            mode="review"
          />

          <MovieSearch media={media} setMedia={setMedia} />

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <select
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="🙂">🙂 Happy</option>
            <option value="😢">😢 Sad</option>
            <option value="😡">😡 Angry</option>
            <option value="😍">😍 Love</option>
            <option value="😐">😐 Neutral</option>
          </select>

          <button
            className="btn btn-error w-full"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </div>
  );
}
