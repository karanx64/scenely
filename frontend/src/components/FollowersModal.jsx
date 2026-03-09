import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Loader from "./Loader";

export default function FollowersModal({ userId, type, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        if (type === "followers") {
          // Get users who follow this user
          const { data, error } = await supabase
            .from("follows")
            .select(
              `
              follower_id,
              users!follows_follower_id_fkey (
                id,
                username,
                avatar
              )
            `,
            )
            .eq("following_id", userId);

          if (error) throw error;

          // Extract user data from the nested structure
          const followers = data.map((item) => item.users);
          setUsers(followers);
        } else if (type === "following") {
          // Get users that this user follows
          const { data, error } = await supabase
            .from("follows")
            .select(
              `
              following_id,
              users!follows_following_id_fkey (
                id,
                username,
                avatar
              )
            `,
            )
            .eq("follower_id", userId);

          if (error) throw error;

          // Extract user data from the nested structure
          const following = data.map((item) => item.users);
          setUsers(following);
        }
      } catch (err) {
        console.error("Failed to fetch followers/following", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-lg w-72 max-h-[80vh] md:w-96 overflow-y-auto relative ring-1 ring-base-300">
        <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-base-content hover:text-error text-xl"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader type="spinner" size="md" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center opacity-70 py-4">No {type} yet</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-neutral text-neutral-content rounded-full flex items-center justify-center text-sm font-bold">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-sm">{user.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
