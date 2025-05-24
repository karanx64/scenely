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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

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
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          )}
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">My Posts</h2>
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
}
