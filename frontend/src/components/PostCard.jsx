import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Eye, Share, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import SharePostModal from "./SharePostModal";
import Modal from "./Modal";
import Loader from "./Loader";
import usePostEngagement from "../hooks/usePostEngagement";

export default function PostCard({ post, onOpen }) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lastNavTime = useRef(0);
  const debounceDelay = 300;

  const images = post.image_urls || [];
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { likesCount, viewsCount, liked, likeLoading, handleLike } =
    usePostEngagement(post.id, user);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete post (likes, views cascade automatically)
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      // Emit event to remove post from UI
      window.dispatchEvent(new CustomEvent("postDeleted", { detail: post.id }));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const postUserId = post.user_id;
  const isOwner = user && postUserId === user.id;
  const username = post.users?.username || "Unknown";
  const avatar = post.users?.avatar;
  const createdAt = post.created_at
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year:
          new Date(post.created_at).getFullYear() === new Date().getFullYear()
            ? undefined
            : "numeric",
      }).format(new Date(post.created_at))
    : "";

  let startX = 0;

  const handleSwipe = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    if (diffX > 50) prev();
    if (diffX < -50) next();
  };

  return (
    <article className="scene-card">
      <div className="scene-card__header">
        <div className="scene-card__author">
          <div className="scene-card__avatar">
            {avatar ? (
              <img src={avatar} alt={username} />
            ) : (
              <div className="scene-card__avatar-fallback">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="scene-card__identity">
            <p className="scene-card__name">{username}</p>
            <div className="scene-card__meta">
              {createdAt && <span>{createdAt}</span>}
              {post.media?.type && (
                <>
                  <span className="scene-card__meta-dot" />
                  <span>{post.media.type}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            type="button"
            className="scene-icon-button"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div
        className="scene-card__frame"
        role="button"
        tabIndex={0}
        onTouchStart={(e) => (startX = e.touches[0].clientX)}
        onTouchEnd={handleSwipe}
        onClick={() => onOpen(post.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(post.id);
          }
        }}
      >
        <div className="scene-card__overlay" />

        {images.length > 0 ? (
          images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post ${i + 1}`}
              className={`scene-card__image ${
                i === index
                  ? "scene-card__image--active"
                  : "scene-card__image--inactive"
              }`}
            />
          ))
        ) : (
          <div className="scene-card__empty">No image</div>
        )}

        <div className="scene-card__content">
          <div className="scene-card__content-main">
            {(post.media?.title || post.emoji) && (
              <p className="scene-card__title">
                {post.emoji && (
                  <span className="scene-card__title-emoji">{post.emoji}</span>
                )}
                {post.media?.title}
                {post.media.year && (
                  <span className="scene-card__year">{post.media.year}</span>
                )}
              </p>
            )}
          </div>

          {images.length > 1 && (
            <div className="scene-card__dots">
              {images.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Go to image ${dotIndex + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIndex(dotIndex);
                  }}
                  className={`scene-card__dot ${
                    dotIndex === index ? "scene-card__dot--active" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              className="scene-card__nav scene-card__nav--left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              className="scene-card__nav scene-card__nav--right"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="scene-card__footer">
        <div className="scene-metric scene-metric--ghost">
          <span className="inline-flex items-center gap-2">
            <Eye size={16} />
            {viewsCount}
          </span>
        </div>

        <button
          type="button"
          className="scene-action scene-card__share"
          onClick={() => setShowShareModal(true)}
        >
          <Share size={18} className="inline" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={handleLike}
          className={`scene-action scene-card__like ${
            liked ? "scene-action--active" : ""
          } ${likeLoading ? "opacity-50" : ""}`}
        >
          {likeLoading ? (
            <Loader type="spinner" size="sm" />
          ) : (
            <>
              <Heart size={18} className={liked ? "fill-current" : ""} />
              <span>{likesCount}</span>
            </>
          )}
        </button>

        {showShareModal && (
          <SharePostModal
            postId={post.id}
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
    </article>
  );
}
