// // components/PostPreview.jsx
// import Cropper from "react-easy-crop";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function PostPreview({
//   images,
//   currentIndex,
//   setCurrentIndex,
//   crop,
//   zoom,
//   setCrop,
//   setZoom,
//   onCropComplete,
//   mode = "crop",
// }) {
//   const prev = () =>
//     setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
//   const next = () =>
//     setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

//   const imageSrc = images[currentIndex];

//   return (
//     <div className="relative aspect-square bg-black overflow-hidden">
//       {mode === "crop" ? (
//         <Cropper
//           image={imageSrc}
//           crop={crop}
//           zoom={zoom}
//           aspect={1.8}
//           onCropChange={setCrop}
//           onZoomChange={setZoom}
//           onCropComplete={onCropComplete}
//           cropShape="rect"
//           minZoom={0.3}
//         />
//       ) : (
//         <img
//           src={imageSrc}
//           alt={`Preview ${currentIndex}`}
//           className="object-contain h-full w-full"
//         />
//       )}

//       {images.length > 1 && (
//         <>
//           <button
//             onClick={prev}
//             className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={next}
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </>
//       )}

//       {images.length > 1 && (
//         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//           {images.map((_, i) => (
//             <div
//               key={i}
//               className={`h-2 w-2 rounded-full ${
//                 i === currentIndex ? "bg-white" : "bg-white/40"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostPreview({
  images,
  currentIndex,
  setCurrentIndex,
  crop,
  setCrop,
  onCropComplete,
  onImageLoaded,
  mode = "crop",
}) {
  console.log("PostPreview render:", { images, currentIndex, mode });

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const imageSrc = images[currentIndex];

  return (
    <div className="relative bg-black w-full min-h-[400px]">
      {mode === "crop" ? (
        <div className="h-full flex items-center justify-center">
          {imageSrc && (
            <div className="max-w-full max-h-[400px]">
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  console.log("Crop changed:", c);
                  setCrop(c);
                }}
                onComplete={(c) => {
                  console.log("Crop complete in PostPreview:", c);
                  onCropComplete(c);
                }}
                circularCrop={false}
                ruleOfThirds
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-full max-h-[400px]"
                  onLoad={(e) => {
                    console.log(
                      "Image loaded in PostPreview:",
                      e.currentTarget
                    );
                    onImageLoaded(e.currentTarget);
                  }}
                />
              </ReactCrop>
            </div>
          )}
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={`Preview ${currentIndex}`}
          className="w-full h-full object-contain"
        />
      )}

      {false && images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="btn btn-sm btn-circle absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="btn btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
