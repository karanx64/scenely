// components/PostCard.jsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import axios from "axios";
import SharePostModal from "./SharePostModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post }) {
  const [index, setIndex] = useState(0);
  const images = post.imageUrls || [];

  //new feature: like and view
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [viewsCount, setViewsCount] = useState(post.views?.length || 0);

  const [showShareModal, setShowShareModal] = useState(false);

  // useEffect(() => {

  //   const timeout = setTimeout(() => {
  //     // Get viewerId (either user ID or guest ID)
  //     let viewerId;

  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       // Decode token to get userId
  //       try {
  //         const payload = JSON.parse(atob(token.split(".")[1]));
  //         viewerId = payload.id;
  //       } catch (err) {
  //         console.error("Invalid token", err);
  //       }
  //     }

  //     // Guest ID fallback
  //     if (!viewerId) {
  //       viewerId = localStorage.getItem("viewerId");
  //       if (!viewerId) {
  //         viewerId = crypto.randomUUID();
  //         localStorage.setItem("viewerId", viewerId);
  //       }
  //     }

  //     axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/view`, {
  //       viewerId,
  //     });
  //   }, 2000); // Wait 2 seconds

  //   return () => clearTimeout(timeout);
  // }, [post._id]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let viewerId;

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          viewerId = payload.id;
        } catch (err) {
          console.error("Invalid token", err);
        }
      }

      if (!viewerId) {
        viewerId = localStorage.getItem("viewerId");
        if (!viewerId) {
          viewerId = crypto.randomUUID();
          localStorage.setItem("viewerId", viewerId);
        }
      }

      axios
        .post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/view`, {
          viewerId,
        })
        .then((res) => {
          setViewsCount(res.data.views); // Update local view count
        })
        .catch((err) => {
          console.error("View tracking failed:", err);
        });
    }, 2000); // wait 2 seconds

    return () => clearTimeout(timeout);
  }, [post._id]);
  const handleLike = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setLikesCount(res.data.likes))
      .catch((err) => console.error("Like error:", err));
  };

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleSwipe = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    if (diffX > 50) prev();
    if (diffX < -50) next();
  };

  //delete logic
  const token = localStorage.getItem("token");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id);
      }
    } catch (err) {
      console.warn("Invalid token:", err);
      setCurrentUserId(null);
    }
  }, [token]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Delete Cloudinary images
      await Promise.all(
        data.imageUrls.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return fetch(
            `${import.meta.env.VITE_API_URL}/upload/cloudinary-delete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ publicId }),
            }
          );
        })
      );

      // Optimistically remove post from UI
      const event = new CustomEvent("postDeleted", { detail: post._id });
      window.dispatchEvent(event);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
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
        {post.media?.title && (
          <p className="text-sm text-gray-500">
            📽️ {post.media.title} ({post.media.type})
          </p>
        )}

        {post.caption && <p>{post.caption}</p>}

        {/* new features: like, emoji, and view */}
        {post.emoji && <p className="text-2xl mb-2">{post.emoji}</p>}

        <div className="flex justify-between items-center text-sm mt-2">
          <button onClick={handleLike} className="text-red-600 hover:underline">
            ❤️ Like ({likesCount})
          </button>
          <span className="text-gray-500">{viewsCount} views</span>
        </div>
      </div>

      {/* delete button */}
      {currentUserId === post.userId._id && (
        <button
          className="mt-2 bg-red-600 text-white py-1 px-2 rounded"
          onClick={handleDelete}
        >
          Delete Post
        </button>
      )}
      <div className="flex gap-4 mt-2">
        {/* Like, comment, etc. buttons */}
        <button
          onClick={() => setShowShareModal(true)}
          className="text-sm text-blue-500 hover:underline"
        >
          Share
        </button>
      </div>
      {showShareModal && (
        <SharePostModal
          postId={post._id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
