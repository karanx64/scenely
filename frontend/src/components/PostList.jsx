import PostCard from "./PostCard";
import { useEffect } from "react";

function PostList({ posts, setPosts }) {
  useEffect(() => {
    const handle = (e) => {
      const deletedId = e.detail;
      setPosts((prev) => prev.filter((p) => p._id !== deletedId));
    };
    window.addEventListener("postDeleted", handle);
    return () => window.removeEventListener("postDeleted", handle);
  }, [setPosts]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">No posts to show.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-base-100 text-base-content">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
export default PostList;
