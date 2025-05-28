// frontend/src/components/conversationList.jsx
import { useEffect, useState } from "react";

export default function ConversationList({ userId, onSelect }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Add a check for token
          console.error("No authentication token found.");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // --- IMPORTANT: Handle HTTP errors here ---
        if (!res.ok) {
          const errorData = await res.json(); // Try to parse error message from backend
          console.error(
            `HTTP error! status: ${res.status}, message: ${
              errorData.message || res.statusText
            }`
          );
          setConversations([]); // Ensure conversations is an empty array on error
          return; // Stop execution here
        }
        // --- End of error handling ---

        const data = await res.json();
        // console.log("Fetched conversations data:", data); // Add for debugging
        setConversations(data);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
        setConversations([]); // Ensure conversations is an empty array on catch
      }
    };
    fetchConversations();
  }, [userId]);

  return (
    <div>
      {Array.isArray(conversations) && conversations.length > 0 ? (
        conversations.map((conv) => {
          const participant =
            conv.sender._id === userId ? conv.recipient : conv.sender;

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(participant._id)}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <p className="text-base-content font-medium">
                {participant.username}
              </p>
            </button>
          );
        })
      ) : (
        <p className="text-center text-base-content/70 py-4">
          No conversations found.
        </p>
      )}
    </div>
  );
}
