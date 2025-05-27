// components/SharePostModal.jsx
import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function SharePostModal({ postId, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim().length === 0) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/search?name=${searchQuery}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchUsers();
  }, [searchQuery]);

  const handleShare = async () => {
    if (!selectedUser) return;

    const body = {
      recipientId: selectedUser._id,
      postId,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Post shared successfully");
      onClose();
    } catch (err) {
      console.error("Failed to share:", err);
      alert(err.message || "Failed to share post");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-2">Share Post</h2>

      <input
        type="text"
        placeholder="Search for a user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      {results.length > 0 && (
        <ul className="max-h-40 overflow-y-auto mb-2">
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setSearchQuery("");
                setResults([]);
              }}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div className="flex items-center gap-2 mb-2">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.username}
            className="w-8 h-8 rounded-full"
          />
          <span>{selectedUser.username}</span>
        </div>
      )}

      <button
        onClick={handleShare}
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={!selectedUser}
      >
        Share
      </button>
    </Modal>
  );
}
