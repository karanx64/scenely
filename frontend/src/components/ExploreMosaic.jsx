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
      className="flex w-auto gap-5"
      columnClassName="flex flex-col gap-5"
    >
      {posts.map((post, postIndex) => {
        const currentImage = post.imageUrls[0];
        const randomHeight = Math.floor(Math.random() * 50) + 300; // 200–300px

        return (
          <div
            key={post._id}
            className="relative bg-black overflow-hidden cursor-pointer "
            style={{ height: `${randomHeight}px` }}
          >
            <img
              src={currentImage}
              alt={`Post ${postIndex}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-white/80">
              {post.emoji && <span className="text-xl">{post.emoji}</span>}
              {post.media.type === "movie" && <Popcorn size={20} />}
              {post.media.type === "tv" && <TvMinimalPlay size={20} />}
            </div>
          </div>
        );
      })}
    </Masonry>
  );
}
