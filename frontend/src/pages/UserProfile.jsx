import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import FollowersModal from "../components/FollowersModal";
import { ArrowUpFromLine, BookUser, HeartHandshake } from "lucide-react";
import Loader from "../components/Loader";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        setLoading(true);

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch user's posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(
            `
            *,
            users!posts_user_id_fkey (
              id,
              username,
              avatar
            )
          `,
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);

        // Fetch followers count
        const { count: followersCount, error: followersError } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        if (followersError) throw followersError;
        setFollowersCount(followersCount || 0);

        // Fetch following count
        const { count: followingCount, error: followingError } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        if (followingError) throw followingError;
        setFollowingCount(followingCount || 0);

        // Check if current user is following this user
        if (currentUser) {
          const { data: followData } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", currentUser.id)
            .eq("following_id", userId)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", userId);

        if (error) throw error;

        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        // Follow
        const { error } = await supabase.from("follows").insert({
          follower_id: currentUser.id,
          following_id: userId,
        });

        if (error) throw error;

        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      alert("Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader type="spinner" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-error text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-text">
      {user && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-2xl gap-6 bg-base-200 shadow-lg">
          <div className="bg-base-300 rounded-2xl flex flex-col items-center p-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {user.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex flex-col justify-between items-center pt-2">
              <p className="font-bold">{user.username}</p>
              <p className="text-sm opacity-70">{user.email}</p>
            </div>
          </div>

          <div className="flex-1 justify-evenly p-2 flex items-center">
            <div className="flex justify-evenly items-center flex-col gap-6">
              <p
                className="cursor-pointer text-primary gap-2 flex items-center"
                onClick={() => setShowModal("followers")}
              >
                <BookUser size={20} className="inline" />
                <span className="font-semibold hidden sm:inline">
                  Followers
                </span>
                {followersCount}
              </p>
              <p
                className="cursor-pointer text-primary gap-2 flex items-center"
                onClick={() => setShowModal("following")}
              >
                <HeartHandshake size={20} className="inline" />
                <span className="font-semibold">Following</span>
                {followingCount}
              </p>
            </div>
          </div>

          {currentUser && currentUser.id !== userId && (
            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded ${
                  isFollowing ? "bg-red-500" : "bg-blue-500"
                } text-white w-full`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/messages?user=${userId}`)
                }
                className="px-4 py-2 rounded bg-green-500 text-white w-full"
              >
                Message
              </button>
            </div>
          )}

          {showModal && (
            <FollowersModal
              userId={userId}
              type={showModal}
              onClose={() => setShowModal(null)}
            />
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2 text-center">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center opacity-70">No posts yet</p>
      ) : (
        <PostList posts={posts} setPosts={setPosts} />
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed md:bottom-4 right-4 bottom-20 z-50 btn btn-primary flex gap-2 items-center"
      >
        <ArrowUpFromLine size={20} className="inline" />
        <span className="hidden md:block">Go to top</span>
      </button>
    </div>
  );
}
