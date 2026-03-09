import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ExploreMosaic from "../components/ExploreMosaic";
import SearchUsers from "../components/SearchUsers";
import { ArrowUpFromLine } from "lucide-react";
import Loader from "../components/Loader";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(
            `
            *,
            users!posts_user_id_fkey (
              id,
              username,
              avatar
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4 text-base-content text-center">
        Zen Scroll
      </h1>
      <SearchUsers />

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader type="spinner" size="md" />
        </div>
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
