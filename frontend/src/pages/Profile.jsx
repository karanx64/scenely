import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import UserAvatar from "../components/UserAvatar"; // add this at the top
import FollowersModal from "../components/FollowersModal";
import { BookUser, HeartHandshake } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0); // Add state for followers count
  const [followingCount, setFollowingCount] = useState(0); // Add state for following count

  const [showModal, setShowModal] = useState(null); // State for showing followers/following modal

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");
        setUser(data);

        // Extract and set the counts
        setFollowersCount(data.followers ? data.followers.length : 0);
        setFollowingCount(data.following ? data.following.length : 0);

        if (data._id) {
          const postRes = await fetch(
            `${import.meta.env.VITE_API_URL}/posts/user/${data._id}`
          );

          const postData = await postRes.json();
          setPosts(postData);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="p-4 text-base-content">
      <h1 className="text-4xl mb-4 text-base-content text-center">
        My Profile
      </h1>

      {error && <p className="text-error">{error}</p>}

      {user && (
        <div className="mb-6 flex items-center justify-between  p-3 rounded-2xl gap-6 bg-base-200 shadow-lg">
          <div className="bg-base-300 rounded-2xl flex flex-col items-center p-3">
            <UserAvatar size={96} clickable={true} showTooltip={false} className="cursor-alias"/>
            <div className="flex flex-col justify-between items-center pt-2">
              <p className="font-bold">{user.username}</p>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="flex-1 justify-evenly p-2 flex items-center  ">
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

          {showModal && user?._id && (
            <FollowersModal
              userId={user._id}
              type={showModal}
              onClose={() => setShowModal(null)}
            />
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">My Posts</h2>
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
}
