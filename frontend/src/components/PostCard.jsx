// components/PostCard.jsx
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import SharePostModal from "./SharePostModal";
import Modal from "./Modal";
import Loader from "./Loader";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post }) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lastNavTime = useRef(0);
  const debounceDelay = 300;

  const images = post.imageUrls || [];

  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [viewsCount, setViewsCount] = useState(post.views?.length || 0);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false); // NEW: loading state for Like button

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      let viewerId;

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
        .post(`${API_URL}/posts/${post._id}/view`, { viewerId })
        .then((res) => {
          setViewsCount(res.data.views);
        })
        .catch((err) => {
          console.error("View tracking failed:", err);
        });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [post._id]);

  indexRef.current = index;

  const prev = () => {
    const now = Date.now();
    if (now - lastNavTime.current < debounceDelay) return;
    lastNavTime.current = now;

    const i = indexRef.current === 0 ? images.length - 1 : indexRef.current - 1;
    indexRef.current = i;
    setIndex(i);
  };

  const next = () => {
    const now = Date.now();
    if (now - lastNavTime.current < debounceDelay) return;
    lastNavTime.current = now;

    const i = indexRef.current === images.length - 1 ? 0 : indexRef.current + 1;
    indexRef.current = i;
    setIndex(i);
  };

  const handleLike = async () => {
    if (likeLoading) return; // Prevent multiple rapid submissions
    setLikeLoading(true); // Disable button immediately
    try {
      const res = await axios.post(
        `${API_URL}/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikesCount(res.data.likes);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false); // Re-enable button after response
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await Promise.all(
        data.imageUrls.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return fetch(`${API_URL}/upload/cloudinary-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ publicId }),
          });
        })
      );

      window.dispatchEvent(
        new CustomEvent("postDeleted", { detail: post._id })
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  let startX = 0;

  const handleSwipe = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    if (diffX > 50) prev();
    if (diffX < -50) next();
  };

  return (
    <div className="card w-full bg-base-100 shadow-md">
      <div
        className="relative aspect-square bg-black overflow-visible"
        onTouchStart={(e) => (startX = e.touches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Post ${i}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <div className="card-body p-4">
        {images.length > 1 && (
          <div className="flex justify-center gap-4 mb-2">
            <button onClick={prev} className="btn btn-sm btn-outline">
              <ChevronLeft size={16} /> Prev
            </button>
            <button onClick={next} className="btn btn-sm btn-outline">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

        {post.media?.title && (
          <p className="text-sm text-base-content/60">
            📽️ {post.media.title} ({post.media.type})
          </p>
        )}

        {post.caption && <p>{post.caption}</p>}
        {post.emoji && <p className="text-2xl">{post.emoji}</p>}

        <div className="flex justify-between items-center text-sm mt-2">
          <button
            onClick={handleLike}
            className={`text-error hover:underline ${
              likeLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={likeLoading} // Disable button while loading
          >
            ❤️ Like ({likesCount})
          </button>
          <span className="text-base-content/60">{viewsCount} views</span>
        </div>

        {currentUserId === post.userId._id && (
          <button
            className="btn btn-error btn-sm mt-2"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Post
          </button>
        )}

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-outline btn-primary btn-sm"
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

        {showDeleteModal && (
          <Modal
            title="Confirm Deletion"
            description="Are you sure you want to delete this post? This cannot be undone."
            type="confirm"
            onConfirm={handleDelete}
            onClose={() => setShowDeleteModal(false)}
          >
            {deleting && <Loader type="spinner" size="sm" />}
          </Modal>
        )}
      </div>
    </div>
  );
}
