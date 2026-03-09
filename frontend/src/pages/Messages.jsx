import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ConversationList from "../components/Messages/ConversationList";
import MessageThread from "../components/Messages/MessageThread";

export default function Messages() {
  const { user } = useAuth();
  const [recipientId, setRecipientId] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [showThread, setShowThread] = useState(false);
  const [searchParams] = useSearchParams();

  // Restore recipientId and recipientInfo from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedRecipientId");
    const storedInfo = localStorage.getItem("selectedRecipientInfo");
    if (stored) setRecipientId(stored);
    if (storedInfo) setRecipientInfo(JSON.parse(storedInfo));
  }, []);

  // Auto-select recipient from query param
  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) setRecipientId(userParam);
  }, [searchParams]);

  // Persist recipientId and recipientInfo to localStorage whenever they change
  useEffect(() => {
    if (recipientId) {
      localStorage.setItem("selectedRecipientId", recipientId);
    }
    if (recipientInfo) {
      localStorage.setItem(
        "selectedRecipientInfo",
        JSON.stringify(recipientInfo),
      );
    }
  }, [recipientId, recipientInfo]);

  return (
    <div className="flex h-[calc(100vh-4rem)] border border-base-300 rounded-lg overflow-hidden">
      {/* Small screen behavior */}
      <div
        className={`w-full sm:w-1/3 border-r border-base-300 ${
          showThread ? "hidden sm:block" : "block"
        }`}
      >
        <ConversationList
          userId={user?.id}
          onSelect={(id, info) => {
            setRecipientId(id);
            setRecipientInfo(info);
            setShowThread(true);
          }}
          selectedId={recipientId}
        />
      </div>
      <div
        className={`w-full sm:w-2/3 p-4 bg-base-100 ${
          showThread ? "block" : "hidden sm:block"
        }`}
      >
        {recipientId ? (
          <MessageThread
            recipientId={recipientId}
            currentUserId={user?.id}
            recipientInfo={recipientInfo}
            onClearThread={() => {
              setRecipientId(null);
              setRecipientInfo(null);
              setShowThread(false);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/50">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
