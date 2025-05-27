import { useState } from "react";
import ConversationList from "../components/Messages/ConversationList";
import MessageThread from "../components/Messages/MessageThread";
import { useEffect } from "react";

export default function Messages() {
  const [recipientId, setRecipientId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setCurrentUserId(data._id);
    };
    getMe();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/3 border-r">
        <ConversationList userId={currentUserId} onSelect={setRecipientId} />
      </div>
      <div className="w-2/3 p-4">
        {recipientId ? (
          <MessageThread
            currentUserId={currentUserId}
            recipientId={recipientId}
          />
        ) : (
          <p>Select a conversation</p>
        )}
      </div>
    </div>
  );
}
