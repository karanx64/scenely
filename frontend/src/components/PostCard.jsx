// components/PostCard.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post }) {
  const [index, setIndex] = useState(0);
  const images = post.imageUrls || [];

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleSwipe = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    if (diffX > 50) prev();
    if (diffX < -50) next();
  };

  let startX = 0;

  return (
    <div className="bg-white rounded shadow mb-6 overflow-hidden w-3xs">
      {/* Image container with aspect ratio */}
      <div
        className="relative aspect-square bg-black overflow-hidden"
        onTouchStart={(e) => (startX = e.touches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        {/* Image */}
        <img
          src={images[index]}
          alt={`Post ${index}`}
          className="object-contain h-full w-full"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="p-4 text-text">
        {post.caption && <p>{post.caption}</p>}
      </div>

      {/* Delete button - only show if user owns the post (optional check) */}
      <div className="flex justify-end px-4 pb-4">
        <button
          onClick={async () => {
            const confirm = window.confirm(
              "Are you sure you want to delete this post?"
            );
            if (!confirm) return;

            const token = localStorage.getItem("token");
            try {
              const res = await fetch(`${API_URL}/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await res.json();
              if (res.ok) {
                alert("Post deleted");
                window.location.reload(); // reload or use state-based removal
              } else {
                alert("Failed: " + data.message);
              }
            } catch (err) {
              console.error("Delete error:", err);
              alert("Error deleting post.");
            }
          }}
          className="text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
