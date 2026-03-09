import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Popcorn,
  TvMinimalPlay,
  HeartPlus,
  Eye,
  Share,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import SharePostModal from "./SharePostModal";
import Modal from "./Modal";
import Loader from "./Loader";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lastNavTime = useRef(0);
  const debounceDelay = 300;

  // Handle both Supabase (image_urls) and MongoDB (imageUrls) format
  const images = post.image_urls || post.imageUrls || [];

  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Fetch initial likes and views count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get likes count
        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        setLikesCount(likesCount || 0);

        // Check if current user liked this post
        if (user) {
          const { data: userLike } = await supabase
            .from("likes")
            .select("id")
            .eq("post_id", post.id)
            .eq("user_id", user.id)
            .maybeSingle();

          setLiked(!!userLike);
        }

        // Get views count
        const { count: viewsCount } = await supabase
          .from("views")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        setViewsCount(viewsCount || 0);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [post.id, user]);

  // Track view after 2 seconds
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        let viewerId = user?.id;

        if (!viewerId) {
          viewerId = localStorage.getItem("viewerId");
          if (!viewerId) {
            viewerId = crypto.randomUUID();
            localStorage.setItem("viewerId", viewerId);
          }
        }

        // Check if already viewed
        const { data: existingView } = await supabase
          .from("views")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", viewerId)
          .maybeSingle();

        if (!existingView) {
          const { error } = await supabase
            .from("views")
            .insert({ post_id: post.id, user_id: viewerId });

          if (!error) {
            setViewsCount((prev) => prev + 1);
          }
        }
      } catch (err) {
        console.error("View tracking error:", err);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [post.id, user]);

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
    if (likeLoading || !user) return;
    setLikeLoading(true);

    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (error) throw error;

        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: post.id, user_id: user.id });

        if (error) throw error;

        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false);
    }
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

  // Get username - handle both Supabase (users object) and MongoDB (userId.username) format
  const username = post.users?.username || post.userId?.username || "Unknown";
  const userAvatar = post.users?.avatar || post.userId?.avatar || "";

  // Handle both user_id (Supabase) and userId (MongoDB)
  const postUserId = post.user_id || post.userId?._id || post.userId;
  const isOwner = user && postUserId === user.id;

  let startX = 0;

  const handleSwipe = (e) => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    if (diffX > 50) prev();
    if (diffX < -50) next();
  };

  return (
    <div className="card w-full bg-base-100 shadow-md rounded-2xl">
      <div
        className={`relative aspect-square bg-black overflow-visible rounded-2xl rounded-b-none`}
        onTouchStart={(e) => (startX = e.touches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        <div className="absolute top-0 left-0 z-15 flex items-center text-white/50 cursor-default hover:text-white/80 transition-all duration-300">
          {post.emoji && <p className="text-xl">{post.emoji}</p>}
          {post.media?.type === "movie" && (
            <Popcorn size={20} className="inline" />
          )}
          {post.media?.type === "tv" && (
            <TvMinimalPlay size={20} className="inline" />
          )}
        </div>

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Post ${i}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 rounded-2xl ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {images.length > 1 && (
          <div className="flex justify-evenly absolute bottom-0 z-15 w-full p-1 text-primary-content/50">
            <button onClick={prev} className="rounded-4xl border-1">
              <ChevronLeft size={16} />
            </button>

            <button onClick={next} className="rounded-4xl border-1">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="card-body p-1">
        <div className="flex">
          {post.media?.title && (
            <p className="text-sm text-base-content/60 inline-flex justify-center">
              {post.media.title}
              {post.media.year && ` (${post.media.year})`}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center text-sm mt-0 relative bottom-0">
          <span
            onClick={handleLike}
            className={`text-base-content/60 flex items-center gap-1 cursor-pointer ${
              likeLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {likeLoading ? (
              <Loader type="spinner" size="sm" />
            ) : (
              <span className="text-base-content/60 flex items-center gap-1">
                {likesCount}
                <HeartPlus
                  size={20}
                  className={`text-base-content/60 ${
                    liked ? "text-red-500 fill-red-500" : ""
                  }`}
                />
              </span>
            )}
          </span>

          <span className="text-base-content/60 flex items-center gap-1 cursor-pointer">
            <Share
              size={20}
              className="inline"
              onClick={() => setShowShareModal(true)}
            />
          </span>

          <span className="text-base-content/60 flex items-center gap-1">
            {viewsCount} <Eye size={20} className="inline" />
          </span>
        </div>

        {post.caption && <p>{post.caption}</p>}

        {/* Show delete button only if user owns the post */}
        {isOwner && (
          <button
            className="btn btn-error btn-xs rounded-none rounded-bl-lg top-0 z-15 right-0 absolute"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={20} />
          </button>
        )}

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
    </div>
  );
}
