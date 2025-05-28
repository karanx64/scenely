import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationList from "../components/Messages/ConversationList";
import MessageThread from "../components/Messages/MessageThread";

export default function Messages() {
  const [recipientId, setRecipientId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchParams] = useSearchParams();

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

  // Auto-select recipient from query param
  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) setRecipientId(userParam);
  }, [searchParams]);

  return (
    <div className="flex h-full border border-base-300 rounded-lg overflow-hidden">
      <div className="w-1/3 border-r border-base-300">
        <ConversationList userId={currentUserId} onSelect={setRecipientId} />
      </div>
      <div className="w-2/3 p-4 bg-base-100">
        {recipientId ? (
          <MessageThread
            currentUserId={currentUserId}
            recipientId={recipientId}
          />
        ) : (
          <p className="text-base-content/70 italic">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
