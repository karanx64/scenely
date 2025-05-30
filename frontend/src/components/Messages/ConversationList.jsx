// import { useEffect, useState } from "react";

// export default function ConversationList({ userId, onSelect, selectedId }) {
//   const [conversations, setConversations] = useState([]);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No authentication token found.");
//           return;
//         }
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/messages/conversations`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) {
//           const errorData = await res.json();
//           console.error(
//             `HTTP error! status: ${res.status}, message: ${
//               errorData.message || res.statusText
//             }`
//           );
//           setConversations([]);
//           return;
//         }
//         const data = await res.json();
//         setConversations(data);
//       } catch (err) {
//         console.error("Failed to fetch conversations", err);
//         setConversations([]);
//       }
//     };
//     fetchConversations();
//   }, [userId]);

//   return (
//     <div>
//       {Array.isArray(conversations) && conversations.length > 0 ? (
//         conversations.map((conv) => {
//           const participant =
//             conv.sender._id === userId ? conv.recipient : conv.sender;
//           const isSelected = participant._id === selectedId;
//           return (
//             <button
//               key={conv._id}
//               onClick={() => onSelect(participant._id, participant)}
//               className={`w-full text-left px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                 isSelected
//                   ? "bg-primary text-primary-content font-bold"
//                   : "hover:bg-base-200"
//               }`}
//             >
//               <p className="text-base-content font-medium">
//                 {participant.username}
//               </p>
//             </button>
//           );
//         })
//       ) : (
//         <p className="text-center text-base-content/70 py-4">
//           No conversations found.
//         </p>
//       )}
//     </div>
//   );
// }
// components/messages/ConversationList.jsx
// components/messages/ConversationList.jsx
import { useEffect, useState } from "react";

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
    <div className="p-4 rounded w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search users by name..."
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {error && <p className="text-error mb-2">{error}</p>}

      {results.length > 0 && (
        <div className="mb-4">
          <button
            onClick={clearResults}
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            Clear Results
          </button>
          <ul className="space-y-2">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => onUserSelect(user)}
                className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer"
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
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
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
        body: JSON.stringify({ recipientId: user._id, text: "" }),
      });
      if (!res.ok) throw new Error("Failed to start conversation");
      setConversations((prev) => [
        ...prev,
        {
          _id: `new-${user._id}`,
          sender: { _id: userId },
          recipient: user,
        },
      ]);
      onSelect(user._id, user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async (participantId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/conversation/${participantId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete conversation");
      setConversations((prev) =>
        prev.filter(
          (conv) =>
            conv.sender._id !== participantId && conv.recipient._id !== participantId
        )
      );
      if (participantId === selectedId) onSelect(null, null); // Clear open conversation
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/3">
        <SearchUsers onUserSelect={handleStartConversation} />
      </div>
      <div className="w-2/3 overflow-y-auto max-h-[600px]">
        {conversations.length === 0 ? (
          <p className="text-center text-base-content/70 py-4">
            No conversations found.
          </p>
        ) : (
          conversations.map((conv) => {
            const participant =
              conv.sender._id === userId ? conv.recipient : conv.sender;
            const isSelected = participant._id === selectedId;
            return (
              <div key={conv._id} className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(participant._id, participant)}
                  className={`flex-1 text-left px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    isSelected
                      ? "bg-primary text-primary-content font-bold"
                      : "hover:bg-base-200"
                  }`}
                >
                  <p className="text-base-content font-medium">
                    {participant.username}
                  </p>
                </button>
                <button
                  onClick={() => handleDeleteConversation(participant._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
