import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import { ArrowUpFromLine } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(`${API_URL}/posts`)
  //     .then((res) => res.json())
  //     .then((data) => setPosts(data))
  //     .catch((err) => console.error("Fetch error:", err))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.text()) // 👈 get raw text
      .then((text) => {
        // console.log("Raw response:", text); // 👀 see what the backend actually sends
        try {
          const data = JSON.parse(text);
          setPosts(data);
        } catch (err) {
          console.error("JSON parse failed:", err);
        }
      })
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-center text-4xl mb-6">Home</h1>
      {loading ? (
        <div className="text-base-content/70 text-center py-4">Loading...</div>
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
