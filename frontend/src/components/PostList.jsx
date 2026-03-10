import PostCard from "./PostCard";
import PostLightbox from "./PostLightbox";
import { useEffect, useState } from "react";

function PostList({ posts, setPosts }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const handle = (e) => {
      const deletedId = e.detail;
      setPosts((prev) => prev.filter((p) => p.id !== deletedId));
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
    <>
      <div className="scene-feed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpen={(postId) =>
              setLightboxIndex(posts.findIndex((item) => item.id === postId))
            }
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <PostLightbox
          posts={posts}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrevPost={() =>
            setLightboxIndex((prev) =>
              prev === 0 ? posts.length - 1 : prev - 1,
            )
          }
          onNextPost={() =>
            setLightboxIndex((prev) =>
              prev === posts.length - 1 ? 0 : prev + 1,
            )
          }
        />
      )}
    </>
  );
}
export default PostList;
