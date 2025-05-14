import PostCard from "./PostCard";

function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">No posts to show.</div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
