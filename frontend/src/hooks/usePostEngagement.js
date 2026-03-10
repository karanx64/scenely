import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function usePostEngagement(postId, user) {
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { count: nextLikesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        setLikesCount(nextLikesCount || 0);

        if (user) {
          const { data: userLike } = await supabase
            .from("likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .maybeSingle();

          setLiked(!!userLike);
        }

        const { count: nextViewsCount } = await supabase
          .from("views")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        setViewsCount(nextViewsCount || 0);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [postId, user]);

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

        const { data: existingView } = await supabase
          .from("views")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", viewerId)
          .maybeSingle();

        if (!existingView) {
          const { error } = await supabase
            .from("views")
            .insert({ post_id: postId, user_id: viewerId });

          if (!error) {
            setViewsCount((prev) => prev + 1);
          }
        }
      } catch (err) {
        console.error("View tracking error:", err);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [postId, user]);

  const handleLike = async () => {
    if (likeLoading || !user) return;
    setLikeLoading(true);

    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;

        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: postId, user_id: user.id });

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

  return {
    likesCount,
    viewsCount,
    liked,
    likeLoading,
    handleLike,
  };
}
