import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImage from "../utils/cropImage";

export default function PostPreview({ images, onCropped }) {
  const [croppedImages, setCroppedImages] = useState([]);
  const [cropData, setCropData] = useState(
    images.map(() => ({
      zoom: 1,
      crop: { x: 0, y: 0 },
      croppedAreaPixels: null,
      done: false,
    }))
  );

  const handleCropComplete = (index) => (_, areaPixels) => {
    const updated = [...cropData];
    updated[index].croppedAreaPixels = areaPixels;
    setCropData(updated);
  };

  const handleCropAndContinue = async (index) => {
    const imageSrc = images[index].preview;
    console.log("Cropping image:", imageSrc);

    if (!imageSrc) {
      console.error("Missing preview image for cropping");
      return;
    }

    console.log("Cropping with area:", cropData[index].croppedAreaPixels);

    const { file, preview } = await getCroppedImage(
      imageSrc,
      cropData[index].croppedAreaPixels
    );

    const newCropped = [
      ...croppedImages,
      { id: images[index].id, file, preview },
    ];
    setCroppedImages(newCropped);

    const updated = [...cropData];
    updated[index].done = true;
    setCropData(updated);

    if (newCropped.length === images.length) {
      onCropped(newCropped.map((i) => i.file));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((img, index) =>
        cropData[index]?.done ? (
          <div
            key={img.id}
            className="w-full aspect-square bg-black flex items-center justify-center"
          >
            <img
              src={
                croppedImages.find((i) => i.id === images[index].id)?.preview
              }
              alt="Cropped"
              className="object-contain w-full h-full"
            />
          </div>
        ) : (
          <div key={index} className="w-full aspect-square relative bg-black">
            <Cropper
              image={img.preview}
              crop={cropData[index].crop}
              zoom={cropData[index].zoom}
              aspect={1}
              minZoom={0.3}
              restrictPosition={false}
              snapToCrop={true}
              objectFit="contain"
              onCropChange={(crop) => {
                const updated = [...cropData];
                updated[index].crop = crop;
                setCropData(updated);
              }}
              onZoomChange={(zoom) => {
                const updated = [...cropData];
                updated[index].zoom = zoom;
                setCropData(updated);
              }}
              onCropComplete={handleCropComplete(index)}
              showGrid={false}
            />
            <button
              onClick={() => handleCropAndContinue(index)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white rounded"
            >
              Crop and Continue
            </button>
          </div>
        )
      )}
    </div>
  );
}
