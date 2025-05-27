// export function createImage(url) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = (err) => reject(new Error("Failed to load image: " + url));
//     img.src = url;
//   });
// }

// export default async function getCroppedImage(
//   imageSrc,
//   cropArea,
//   customName = null
// ) {
//   const image = await createImage(imageSrc);

//   const scaleX = image.naturalWidth / image.width;
//   const scaleY = image.naturalHeight / image.height;

//   const cropWidth = cropArea.width * scaleX;
//   const cropHeight = cropArea.height * scaleY;
//   const cropX = cropArea.x * scaleX;
//   const cropY = cropArea.y * scaleY;

//   // Create a square canvas (1:1 aspect ratio)
//   const size = Math.max(cropWidth, cropHeight);
//   const canvas = document.createElement("canvas");
//   canvas.width = size;
//   canvas.height = size;

//   const ctx = canvas.getContext("2d");

//   // Fill canvas with black background (letterboxing)
//   ctx.fillStyle = "black";
//   ctx.fillRect(0, 0, size, size);

//   // Center the cropped image in the square canvas
//   const offsetX = (size - cropWidth) / 2;
//   const offsetY = (size - cropHeight) / 2;

//   ctx.drawImage(
//     image,
//     cropX,
//     cropY,
//     cropWidth,
//     cropHeight,
//     offsetX,
//     offsetY,
//     cropWidth,
//     cropHeight
//   );

//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (!blob) return reject(new Error("Canvas is empty"));
//       const filename =
//         customName || `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;

//       const file = new File([blob], filename, { type: "image/jpeg" });
//       const preview = URL.createObjectURL(blob);
//       resolve({ file, preview });
//     }, "image/jpeg");
//   });
// }

export default async function getCroppedImage(image, crop, customName = null) {
  // crop: { x, y, width, height, unit }
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Make a square canvas
  const size = Math.max(cropWidth, cropHeight);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Fill with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  // Center the crop in the square canvas
  const offsetX = (size - cropWidth) / 2;
  const offsetY = (size - cropHeight) / 2;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    offsetX,
    offsetY,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      const filename =
        customName || `${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const file = new File([blob], filename, { type: "image/jpeg" });
      const preview = URL.createObjectURL(blob);
      resolve({ file, preview });
    }, "image/jpeg");
  });
}
