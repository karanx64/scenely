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
      {/* Add a check for conversations being an array before mapping */}
      {Array.isArray(conversations) && conversations.length > 0 ? (
        conversations.map((conv) => {
          const participant =
            conv.sender._id === userId ? conv.recipient : conv.sender;

          return (
            <div key={conv._id} onClick={() => onSelect(participant._id)}>
              <p>{participant.username}</p>
            </div>
          );
        })
      ) : (
        <p>No conversations found.</p> // Or a loading spinner
      )}
    </div>
  );
}
