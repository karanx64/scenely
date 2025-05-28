// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
const API_URL = import.meta.env.VITE_API_URL;
import SearchUsers from "../components/SearchUsers";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-base-content">Explore</h1>
      <SearchUsers />

      {loading ? (
        <p className="text-base-content/70">Loading...</p>
      ) : posts.length > 0 ? (
        <PostList posts={posts} setPosts={setPosts} />
      ) : (
        <p className="text-base-content/70">No posts available.</p>
      )}
    </div>
  );
}
