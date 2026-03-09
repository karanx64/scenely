import Masonry from "react-masonry-css";
import { Popcorn, TvMinimalPlay } from "lucide-react";

export default function ExploreMosaic({ posts }) {
  const breakpointColumns = {
    default: 5,
    1200: 4,
    992: 3,
    768: 2,
    576: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-1"
      columnClassName="flex flex-col gap-1"
    >
      {posts.map((post, postIndex) => {
        // Handle both Supabase (image_urls) and MongoDB (imageUrls)
        const images = post.image_urls || post.imageUrls || [];
        const currentImage = images[0];
        const randomHeight = Math.floor(Math.random() * 10) + 300;

        // Use Supabase id or MongoDB _id
        const postId = post.id || post._id;

        return (
          <div
            key={postId}
            className="relative bg-black overflow-hidden cursor-pointer"
            style={{ height: `${randomHeight}px` }}
          >
            <img
              src={currentImage}
              alt={`Post ${postIndex}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-white/80">
              {post.emoji && <span className="text-xl">{post.emoji}</span>}
              {post.media?.type === "movie" && <Popcorn size={20} />}
              {post.media?.type === "tv" && <TvMinimalPlay size={20} />}
            </div>
          </div>
        );
      })}
    </Masonry>
  );
}
