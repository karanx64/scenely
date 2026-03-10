import { useState, useEffect } from "react";
import Modal from "./Modal";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function SharePostModal({ postId, onClose }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shareResult, setShareResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim().length === 0) {
        setResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, avatar")
          .ilike("username", `%${searchQuery}%`)
          .limit(20);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const handleShare = async () => {
    if (!selectedUser || !user) return;

    const body = {
      sender_id: user.id,
      recipient_id: selectedUser.id,
      post_id: postId,
      text: null,
    };

    try {
      const { error } = await supabase.from("messages").insert(body);
      if (error) throw error;

      setShareResult("success");
    } catch (err) {
      console.error("Failed to share:", err);
      setErrorMessage(err.message || "Failed to share post");
      setShareResult("error");
    }
  };

  return (
    <>
      <Modal onClose={onClose}>
        <h2 className="text-lg font-semibold mb-3 text-base-content">
          Share Post
        </h2>

        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full input input-bordered mb-3"
        />

        {results.length > 0 && (
          <ul className="max-h-40 overflow-y-auto mb-3 space-y-2">
            {results.map((foundUser) => (
              <li
                key={foundUser.id}
                onClick={() => {
                  setSelectedUser(foundUser);
                  setSearchQuery("");
                  setResults([]);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
              >
                <img
                  src={foundUser.avatar}
                  alt={foundUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-base-content">{foundUser.username}</span>
              </li>
            ))}
          </ul>
        )}

        {selectedUser && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-base-content">{selectedUser.username}</span>
          </div>
        )}

        <button
          onClick={handleShare}
          className="btn btn-primary w-full"
          disabled={!selectedUser || !user}
        >
          Share
        </button>
      </Modal>
      {shareResult === "success" && (
        <Modal
          onClose={() => {
            setShareResult(null);
            onClose();
          }}
        >
          <h2 className="text-lg font-semibold text-base-content mb-4">
            Post shared successfully
          </h2>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              setShareResult(null);
              onClose();
            }}
          >
            Close
          </button>
        </Modal>
      )}

      {shareResult === "error" && (
        <Modal onClose={() => setShareResult(null)}>
          <h2 className="text-lg font-semibold text-error mb-4">Error</h2>
          <p className="text-base-content mb-4">{errorMessage}</p>
          <button
            className="btn btn-error w-full"
            onClick={() => setShareResult(null)}
          >
            Close
          </button>
        </Modal>
      )}
    </>
  );
}
