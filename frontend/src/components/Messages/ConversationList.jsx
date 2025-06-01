// components/messages/ConversationList.jsx
import { useEffect, useState } from "react";
import { Search, Delete } from "lucide-react";

function SearchUsers({ onUserSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/search?name=${encodeURIComponent(
          query
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Search failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearResults = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return (
    <div className="flex justify-center p-4 flex-col align-middle">
      <div className="p-2">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search users by name..."
            className="input input-bordered flex-1 rounded-r-none border-r-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary rounded-none"
            onClick={clearResults}
          >
            <Delete size={20} />
          </button>
          <button type="submit" className="btn btn-primary rounded-l-none">
            <Search size={20} className="text-primary-content" />
          </button>
        </form>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}{" "}
      {/* Assuming red for error */}
      {results.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-2 ">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => onUserSelect(user)}
                className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer" // Adjusted hover for light background
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <p className="font-medium ">{user.username}</p>{" "}
                  {/* Adjusted text color */}
                  <p className="text-sm ">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ConversationList({ userId, onSelect, selectedId }) {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return setConversations([]);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/messages/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          setConversations([]);
          return;
        }
        const data = await res.json();
        setConversations(data);
      } catch {
        setConversations([]);
      }
    };
    fetchConversations();
  }, [userId, token]);

  const handleStartConversation = async (user) => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: user._id, text: "Hello" }),
      });
      if (!res.ok) throw new Error("Failed to start conversation");
      // Assuming a conversation is returned or a new one is created on the backend
      // For now, we'll manually add it to the list as a temporary representation
      setConversations((prev) => {
        // Check if conversation with this user already exists to avoid duplicates
        const exists = prev.some(
          (conv) =>
            (conv.sender?._id === userId && conv.recipient?._id === user._id) ||
            (conv.sender?._id === user._id && conv.recipient?._id === userId)
        );
        if (exists) {
          onSelect(user._id, user); // Select existing if found
          return prev;
        }

        const newConversation = {
          _id: `new-${user._id}-${Date.now()}`, // Unique temporary ID
          sender: { _id: userId, username: "You" }, // Placeholder for current user
          recipient: user,
          messages: [], // Initialize with empty messages
        };
        onSelect(user._id, user);
        return [newConversation, ...prev]; // Add new conversation to the top
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async (participantId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/messages/conversation/${participantId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete conversation");
      setConversations((prev) =>
        prev.filter(
          (conv) =>
            conv.sender &&
            conv.sender._id !== participantId &&
            conv.recipient &&
            conv.recipient._id !== participantId
        )
      );
      if (participantId === selectedId) onSelect(null, null); // Clear open conversation
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-base">
      {" "}
      {/* Added background and border for the pane */}
      <div className="p-2">
        {" "}
        {/* Separator for search area */}
        <SearchUsers onUserSelect={handleStartConversation} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {" "}
        {/* This will take remaining height and be scrollable */}
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No conversations found.
          </p>
        ) : (
          <ul className="space-y-1 p-2">
            {" "}
            {/* Added padding for list items */}
            {conversations.map((conv) => {
              const participant =
                conv.sender && conv.sender._id === userId
                  ? conv.recipient
                  : conv.sender;
              const isSelected = participant && participant._id === selectedId;

              // If participant is null or undefined, skip rendering this conversation
              if (!participant) return null;

              return (
                <li key={conv._id} className="flex items-center">
                  <button
                    onClick={() => onSelect(participant._id, participant)}
                    className={`flex-1 text-left px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary ${
                      isSelected
                        ? "bg-primary text-primary-content font-bold" // Used specific purple
                        : "bg-primary text-primary-content font-bold" // Adjusted hover for light background, text color
                    }`}
                  >
                    <p className="font-medium">{participant.username}</p>
                  </button>

                  {/* <button
                    onClick={() => handleDeleteConversation(participant._id)}
                    className="btn bg-error hover:bg-error text-primary-content btn-sm border-none rounded-l-none ring-4 ring-error" // Adjusted delete button
                  >
                    Delete
                  </button> */}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
