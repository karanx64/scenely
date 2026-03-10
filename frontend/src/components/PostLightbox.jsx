import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import SharePostModal from "./SharePostModal";
import usePostEngagement from "../hooks/usePostEngagement";

export default function PostLightbox({
  posts,
  currentIndex,
  onClose,
  onPrevPost,
  onNextPost,
}) {
  const { user } = useAuth();
  const post = posts[currentIndex];
  const [imageIndex, setImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const { likesCount, viewsCount, liked, likeLoading, handleLike } =
    usePostEngagement(post.id, user);

  useEffect(() => {
    setImageIndex(0);
  }, [post.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevPost();
      if (event.key === "ArrowRight") onNextPost();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNextPost, onPrevPost]);

  const images = post.image_urls || [];
  const hasMultipleImages = images.length > 1;
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

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="scene-lightbox" onClick={onClose}>
        <button
          type="button"
          className="scene-lightbox__post-nav scene-lightbox__post-nav--left"
          aria-label="Previous post"
          onClick={(event) => {
            event.stopPropagation();
            onPrevPost();
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <div className="scene-lightbox__dialog" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="scene-lightbox__close"
            aria-label="Close lightbox"
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div className="scene-lightbox__media">
            {images.length > 0 ? (
              <img
                src={images[imageIndex]}
                alt={`${post.media?.title || "Post"} ${imageIndex + 1}`}
                className="scene-lightbox__image"
              />
            ) : (
              <div className="scene-card__empty">No image</div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  className="scene-lightbox__image-nav scene-lightbox__image-nav--left"
                  aria-label="Previous image"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="scene-lightbox__image-nav scene-lightbox__image-nav--right"
                  aria-label="Next image"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={18} />
                </button>
                <div className="scene-lightbox__image-dots">
                  {images.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={`scene-card__dot ${
                        dotIndex === imageIndex ? "scene-card__dot--active" : ""
                      }`}
                      aria-label={`Go to image ${dotIndex + 1}`}
                      onClick={() => setImageIndex(dotIndex)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="scene-lightbox__meta">
            <div className="scene-lightbox__meta-top">
              <span>{post.users?.username || "Unknown"}</span>
              {createdAt && <span>{createdAt}</span>}
              {post.media?.type && <span>{post.media.type}</span>}
            </div>

            {(post.media?.title || post.emoji) && (
              <p className="scene-lightbox__title">
                {post.emoji && (
                  <span className="scene-lightbox__title-emoji">{post.emoji}</span>
                )}
                <span>{post.media?.title || "Untitled scene"}</span>
                {post.media?.year && (
                  <span className="scene-lightbox__year">{post.media.year}</span>
                )}
              </p>
            )}

            {post.caption && (
              <p className="scene-lightbox__caption">{post.caption}</p>
            )}

            <div className="scene-lightbox__actions">
              <div className="scene-metric scene-metric--ghost">
                <Eye size={16} />
                {viewsCount}
              </div>

              <button
                type="button"
                className="scene-action"
                onClick={() => setShowShareModal(true)}
              >
                <Share size={16} />
                <span>Share</span>
              </button>

              <button
                type="button"
                className={`scene-action ${liked ? "scene-action--active" : ""}`}
                onClick={handleLike}
              >
                {likeLoading ? (
                  <Loader type="spinner" size="sm" />
                ) : (
                  <>
                    <Heart size={16} className={liked ? "fill-current" : ""} />
                    <span>{likesCount}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="scene-lightbox__post-nav scene-lightbox__post-nav--right"
          aria-label="Next post"
          onClick={(event) => {
            event.stopPropagation();
            onNextPost();
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {showShareModal && (
        <SharePostModal postId={post.id} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}
