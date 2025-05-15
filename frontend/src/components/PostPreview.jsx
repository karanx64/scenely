import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PostPreview = ({ images, onCropped }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [croppedResults, setCroppedResults] = useState([]);

  const currentImage = images[currentIndex];

  const onLoad = useCallback((img) => {
    imageRef.current = img;

    // Initialize crop after image loads
    const aspect = 1;
    const width = 90;

    const height = (img.naturalHeight / img.naturalWidth) * width;

    setCrop({
      unit: "%",
      x: 5,
      y: 5,
      width,
      height,
      aspect,
    });
  }, []);

  const cropAndContinue = useCallback(() => {
    if (
      !completedCrop ||
      !imageRef.current ||
      !previewCanvasRef.current ||
      !completedCrop.width ||
      !completedCrop.height
    ) {
      console.warn("⛔ Missing crop or refs");
      return;
    }

    const canvas = previewCanvasRef.current;
    const image = imageRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("❌ Canvas is empty");
        return;
      }

      const croppedFile = new File([blob], currentImage.file.name, {
        type: "image/png",
      });

      const newPreview = URL.createObjectURL(croppedFile);
      const updatedResults = [
        ...croppedResults,
        { id: currentImage.id, file: croppedFile, preview: newPreview },
      ];
      setCroppedResults(updatedResults);

      if (currentIndex + 1 < images.length) {
        setCurrentIndex(currentIndex + 1);
        setCompletedCrop(null);
        setCrop(undefined); // force recrop init
      } else {
        onCropped(updatedResults);
      }
    }, "image/png");
  }, [
    completedCrop,
    currentImage,
    currentIndex,
    croppedResults,
    images.length,
    onCropped,
  ]);

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCompletedCrop(null);
      setCrop(undefined);
    }
  };

  const next = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCompletedCrop(null);
      setCrop(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm aspect-square">
        {currentImage ? (
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
            <img
              src={currentImage.preview}
              onLoad={(e) => onLoad(e.target)}
              alt="Crop target"
              className="max-h-[80vh]"
            />
          </ReactCrop>
        ) : (
          <p>No image found.</p>
        )}

        {/* Navigation arrows */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2">
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {currentIndex < images.length - 1 && (
            <button
              onClick={next}
              className="bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={cropAndContinue}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Crop and Continue
      </button>

      <canvas ref={previewCanvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default PostPreview;
