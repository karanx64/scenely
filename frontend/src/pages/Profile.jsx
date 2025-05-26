// import { useEffect, useState } from "react";
// import PostList from "../components/PostList";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setError(null);

//         // Fetch the user profile
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch user");
//         setUser(data);

//         // Fetch the posts of the user using the user._id
//         if (data._id) {
//           const postRes = await fetch(
//             `${import.meta.env.VITE_API_URL}/posts/user/${data._id}`
//           );

//           const postData = await postRes.json();
//           setPosts(postData);
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (token) fetchProfile();
//   }, [token]);

//   return (
//     <div className="p-4 text-text">
//       <h1 className="text-2xl font-bold mb-4">My Profile</h1>

//       {error && <p className="text-red-500">{error}</p>}
//       {user && (
//         <div className="mb-4">
//           <p>
//             <strong>Username:</strong> {user.username}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//         </div>
//       )}

//       <h2 className="text-xl font-semibold mb-2">My Posts</h2>
//       <PostList posts={posts} setPosts={setPosts} />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import UserAvatar from "../components/UserAvatar"; // add this at the top
import FollowersModal from "../components/FollowersModal";

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
    <div className="p-4 text-text">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {error && <p className="text-red-500">{error}</p>}

      {user && (
        <div className="mb-6">
          <UserAvatar size={96} clickable={true} showTooltip={false} />
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Display Followers Count */}
          <p
            className="cursor-pointer"
            onClick={() => setShowModal("followers")}
          >
            <strong>Followers:</strong> {followersCount}
          </p>
          {/* Display Following Count */}
          <p
            className="cursor-pointer"
            onClick={() => setShowModal("following")}
          >
            <strong>Following:</strong> {followingCount}
          </p>

          {showModal &&
            user?._id && ( // Ensure user._id is available before rendering modal
              <FollowersModal
                userId={user._id} // Pass the current user's ID to the modal
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
