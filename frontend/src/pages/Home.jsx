import { useEffect, useState } from "react";
import PostList from "../components/PostList";

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
        console.log("Raw response:", text); // 👀 see what the backend actually sends
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
      <h1 className="text-xl font-bold mb-4">Home</h1>
      {loading ? <p>Loading...</p> : <PostList posts={posts} />}
    </div>
  );
}
