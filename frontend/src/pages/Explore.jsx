// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
const API_URL = import.meta.env.VITE_API_URL;

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
      <h1 className="text-xl font-semibold mb-4">Explore</h1>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}
