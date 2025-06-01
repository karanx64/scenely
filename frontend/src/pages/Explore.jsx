// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import ExploreMosaic from "../components/ExploreMosaic";
const API_URL = import.meta.env.VITE_API_URL;
import SearchUsers from "../components/SearchUsers";
import { ArrowUpFromLine } from "lucide-react";

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
      <h1 className="text-4xl mb-4 text-base-content text-center">
        Zen Scroll
      </h1>
      <SearchUsers />

      {loading ? (
        <p className="text-base-content/70">Loading...</p>
      ) : posts.length > 0 ? (
        <ExploreMosaic posts={posts} setPosts={setPosts} />
      ) : (
        <p className="text-base-content/70">No posts available.</p>
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
