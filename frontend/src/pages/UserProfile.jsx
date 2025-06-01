import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import FollowersModal from "../components/FollowersModal";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showModal, setShowModal] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUser(data.user);
        setFollowersCount(data.followersCount);
        setFollowingCount(data.followingCount);

        const postRes = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/user/${userId}`
        );
        const postData = await postRes.json();
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCurrentUser = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCurrentUserId(data._id);
        setIsFollowing(data.following.includes(userId));
      } catch (err) {
        console.error("Failed to get current user:", err);
      }
    };

    fetchProfile();
    fetchCurrentUser();
  }, [userId, token]);

  const handleFollowToggle = async () => {
    const endpoint = isFollowing ? "unfollow" : "follow";
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${endpoint}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to update follow status");

      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => prev + (isFollowing ? -1 : 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 text-text">
      {error && <p className="text-error mb-4">{error}</p>}

      {user && (
        <section className="mb-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4">
              {user.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <div className="space-y-1">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setShowModal("followers")}
            >
              <strong>Followers:</strong> {followersCount}
            </p>
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setShowModal("following")}
            >
              <strong>Following:</strong> {followingCount}
            </p>
          </div>

          {showModal && (
            <FollowersModal
              userId={userId}
              type={showModal}
              onClose={() => setShowModal(null)}
            />
          )}

          {currentUserId && currentUserId !== user._id && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded ${
                  isFollowing ? "bg-red-500" : "bg-blue-500"
                } text-white`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/messages?user=${user._id}`)
                }
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Message
              </button>
            </div>
          )}
        </section>
      )}

      <h2 className="text-xl font-semibold mb-2">Posts</h2>
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
}
