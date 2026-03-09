import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import PostList from "../components/PostList";
import UserAvatar from "../components/UserAvatar";
import FollowersModal from "../components/FollowersModal";
import Loader from "../components/Loader";
import { BookUser, HeartHandshake, ArrowUpFromLine } from "lucide-react";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;

      try {
        setError(null);
        setIsLoading(true);

        // Fetch user profile from users table
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError) throw profileError;
        setUser(profileData);

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
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);

        // Fetch followers count
        const { count: followersCount, error: followersError } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", authUser.id);

        if (followersError) throw followersError;

        // Fetch following count
        const { count: followingCount, error: followingError } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", authUser.id);

        if (followingError) throw followingError;

        setFollowersCount(followersCount || 0);
        setFollowingCount(followingCount || 0);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (isLoading) {
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
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <UserAvatar size={100} clickable={true} showTooltip={false} />
          <h1 className="text-2xl font-bold mt-4">{user?.username}</h1>
          <p className="text-sm opacity-70">{user?.email}</p>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <button
              onClick={() => setShowModal("followers")}
              className="flex flex-col items-center hover:opacity-80"
            >
              <span className="font-bold">{followersCount}</span>
              <span className="text-sm opacity-70">Followers</span>
            </button>
            <button
              onClick={() => setShowModal("following")}
              className="flex flex-col items-center hover:opacity-80"
            >
              <span className="font-bold">{followingCount}</span>
              <span className="text-sm opacity-70">Following</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold">{posts.length}</span>
              <span className="text-sm opacity-70">Posts</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Posts</h2>
          {posts.length === 0 ? (
            <p className="text-center opacity-70">No posts yet</p>
          ) : (
            <PostList posts={posts} setPosts={setPosts} />
          )}
        </div>

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed md:bottom-4 right-4 bottom-20 z-50 btn btn-primary flex gap-2 items-center"
        >
          <ArrowUpFromLine size={20} className="inline" />
          <span className="hidden md:block">Go to top</span>
        </button>
      </div>

      {/* Followers/Following Modal */}
      {showModal && (
        <FollowersModal
          userId={authUser.id}
          type={showModal}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
}
