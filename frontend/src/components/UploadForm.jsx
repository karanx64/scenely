// import { useState } from "react";
// import PostPreview from "./PostPreview";
// import getCroppedImg from "../utils/cropImage";
// import axios from "axios";
// import MovieSearch from "./MovieSearch";

// export default function UploadForm() {
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [croppedImages, setCroppedImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [crop, setCrop] = useState({
//     // aspect: 1,
//     unit: "%",
//     width: 80,
//     height: 80,
//     x: 10,
//     y: 10,
//   });
//   const [completedCrop, setCompletedCrop] = useState(null);
//   const [imageRef, setImageRef] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [step, setStep] = useState("select");
//   const [emoji, setEmoji] = useState("😐");

//   const [media, setMedia] = useState({
//     title: "",
//     tmdbId: "",
//     type: "",
//   });

//   const timestamp = Date.now();
//   const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;

//   const onImageLoaded = (img) => {
//     console.log("Image loaded in UploadForm:", img);
//     setImageRef(img);
//     const width = 80;
//     const height = 80;
//     setCrop((prevCrop) => ({
//       ...prevCrop,
//       width,
//       height,
//       x: (100 - width) / 2,
//       y: (100 - height) / 2,
//     }));
//     return false;
//   };

//   const handleCropComplete = (c) => {
//     console.log("Crop complete in UploadForm:", c);
//     if (c.width && c.height) {
//       setCompletedCrop(c);
//     }
//   };

//   const handleFiles = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

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
//       console.log("Selected images loaded:", images);
//       setCroppedImages(new Array(images.length).fill(null));
//       setCurrentIndex(0);
//       setImageRef(null);
//       setCompletedCrop(null);
//       setCrop({
//         aspect: 1,
//         unit: "%",
//         width: 80,
//         height: 80,
//         x: 10,
//         y: 10,
//       });
//       setStep("crop");
//     });
//   };

//   const handleCropAndContinue = async () => {
//     if (!completedCrop || !imageRef) {
//       console.log("Missing crop or imageRef:", { completedCrop, imageRef });
//       return;
//     }
//     try {
//       const cropped = await getCroppedImg(imageRef, completedCrop);
//       console.log("Successfully cropped image:", cropped);
//       setCroppedImages((prev) => {
//         const updated = [...prev];
//         updated[currentIndex] = cropped;
//         return updated;
//       });
//       if (currentIndex < selectedImages.length - 1) {
//         setCurrentIndex(currentIndex + 1);
//         setCrop({
//           aspect: 1,
//           unit: "%",
//           width: 80,
//           height: 80,
//           x: 10,
//           y: 10,
//         });
//       } else {
//         setStep("review");
//         setCurrentIndex(0);
//       }
//     } catch (err) {
//       console.error("Failed to crop image:", err);
//       alert("Failed to crop image. Please try again.");
//     }
//   };

//   const handlePrev = () => {
//     setCurrentIndex((i) => (i === 0 ? selectedImages.length - 1 : i - 1));
//     setCrop({
//       aspect: 1,
//       unit: "%",
//       width: 80,
//       height: 80,
//       x: 10,
//       y: 10,
//     });
//   };

//   const handleNext = () => {
//     setCurrentIndex((i) => (i === selectedImages.length - 1 ? 0 : i + 1));
//     setCrop({
//       aspect: 1,
//       unit: "%",
//       width: 80,
//       height: 80,
//       x: 10,
//       y: 10,
//     });
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
//         // formData.append("namedTransformation", "square-fit");
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
//         { imageUrls, caption, emoji, media },
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
//           onChange={handleFiles}
//           className="file-input file-input-bordered w-full"
//         />
//       )}

//       {step === "crop" && selectedImages.length > 0 && (
//         <div className="space-y-4">
//           <PostPreview
//             images={selectedImages}
//             currentIndex={currentIndex}
//             setCurrentIndex={setCurrentIndex}
//             crop={crop}
//             setCrop={setCrop}
//             onCropComplete={handleCropComplete}
//             onImageLoaded={onImageLoaded}
//             mode="crop"
//           />
//           <div className="flex gap-2">
//             <button className="btn btn-neutral" onClick={handlePrev}>
//               Previous
//             </button>
//             <button
//               className="btn btn-primary flex-1"
//               onClick={handleCropAndContinue}
//             >
//               {currentIndex < selectedImages.length - 1 ? "Next" : "Continue"}
//             </button>
//             <button className="btn btn-neutral" onClick={handleNext}>
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {step === "review" && (
//         <div className="space-y-4">
//           <PostPreview
//             images={croppedImages.map((img) => img.preview)}
//             currentIndex={currentIndex}
//             setCurrentIndex={setCurrentIndex}
//             mode="review"
//           />

//           <MovieSearch media={media} setMedia={setMedia} />

//           <textarea
//             className="textarea textarea-bordered w-full"
//             placeholder="Write a caption..."
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//           />

//           <select
//             value={emoji}
//             onChange={(e) => setEmoji(e.target.value)}
//             className="select select-bordered w-full"
//           >
//             <option value="🙂">🙂 Happy</option>
//             <option value="😢">😢 Sad</option>
//             <option value="😡">😡 Angry</option>
//             <option value="😍">😍 Love</option>
//             <option value="😐">😐 Neutral</option>
//           </select>

//           <button
//             className="btn btn-error w-full"
//             onClick={handleSubmit}
//             disabled={uploading}
//           >
//             {uploading ? "Posting..." : "Post"}
//           </button>
//         </div>
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
  const [cropError, setCropError] = useState(""); // <-- NEW

  const timestamp = Date.now();
  const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;

  const onImageLoaded = (img) => {
    setImageRef(img);

    const isPortrait = img.naturalHeight > img.naturalWidth;
    if (isPortrait) {
      setCropError("Avoid using portrait images.");
    } else {
      setCropError("");
    }

    setCrop({
      aspect: 1,
      unit: "%",
      width: 80,
      height: 80,
      x: 10,
      y: 10,
    });

    return false;
  };

  const handleCropComplete = (c) => {
    if (c.width && c.height) {
      setCompletedCrop(c);
      setCropError(""); // clear error if crop is valid
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
      setCropError(""); // clear error on new selection
    });
  };

  const resetCrop = () => {
    setCompletedCrop(null);
    setImageRef(null);
    setCrop({
      aspect: 1,
      unit: "%",
      width: 80,
      height: 80,
      x: 10,
      y: 10,
    });
  };

  const handleCropAndContinue = async () => {
    if (!completedCrop || !imageRef) {
      setCropError("Please crop the image a little bit.");
      return;
    }

    try {
      const cropped = await getCroppedImg(imageRef, completedCrop);
      const updated = [...croppedImages];
      updated[currentIndex] = cropped;
      setCroppedImages(updated);

      if (currentIndex < selectedImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
        resetCrop();
      } else {
        const missing = updated
          .map((img, i) => (img === null ? i + 1 : null))
          .filter((i) => i !== null);

        if (missing.length > 0) {
          setCropError(`Images ${missing.join(", ")} not cropped.`);
          return;
        }

        setStep("review");
        setCurrentIndex(0);
        setCropError("");
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
    setCropError(""); // clear error on prev
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
    setCropError(""); // clear error on next
  };

  const Prev = () => {
    setCurrentIndex((i) => (i === 0 ? croppedImages.length - 1 : i - 1));
  };

  const Next = () => {
    setCurrentIndex((i) => (i === croppedImages.length - 1 ? 0 : i + 1));
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
        <>
          {cropError && (
            <div className="text-center text-error font-semibold py-2">
              {cropError}
            </div>
          )}
          <div className="space-y-4">
            {selectedImages.length > 1 && (
              <div className="flex gap-2 pt-2 relative z-10">
                <button className="btn btn-neutral" onClick={handlePrev}>
                  Previous
                </button>
                <button
                  className="btn btn-primary flex-1"
                  onClick={handleCropAndContinue}
                >
                  {currentIndex < selectedImages.length - 1
                    ? "Next"
                    : "Continue"}
                </button>
                <button className="btn btn-neutral" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

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

            {selectedImages.length === 1 && (
              <div className="flex gap-2 pt-2 relative z-10">
                <button
                  className="btn btn-primary flex-1"
                  onClick={handleCropAndContinue}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <PostPreview
            images={croppedImages.map((img) => img.preview)}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            mode="review"
          />

          <div className="flex gap-2 pt-2 relative z-10">
            <button className="btn btn-neutral" onClick={Prev}>
              Previous
            </button>
            <button className="btn btn-neutral" onClick={Next}>
              Next
            </button>
          </div>

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
