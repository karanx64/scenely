import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationList from "../components/Messages/ConversationList";
import MessageThread from "../components/Messages/MessageThread";
import { MoveDownLeft } from "lucide-react";

export default function Messages() {
  const [recipientId, setRecipientId] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null); // NEW
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchParams] = useSearchParams();
  const [showThread, setShowThread] = useState(false); // NEW: toggle for small screens

  // Restore recipientId and recipientInfo from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedRecipientId");
    const storedInfo = localStorage.getItem("selectedRecipientInfo");
    if (stored) setRecipientId(stored);
    if (storedInfo) setRecipientInfo(JSON.parse(storedInfo));
  }, []);

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

  // Persist recipientId and recipientInfo to localStorage whenever they change
  useEffect(() => {
    if (recipientId) {
      localStorage.setItem("selectedRecipientId", recipientId);
    }
    if (recipientInfo) {
      localStorage.setItem(
        "selectedRecipientInfo",
        JSON.stringify(recipientInfo)
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
          userId={currentUserId}
          onSelect={(id, info) => {
            setRecipientId(id);
            setRecipientInfo(info);
            setShowThread(true); // Show thread on small screens
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
          <>
            {/* Back button for small screens */}
            <button
              className=" sm:hidden top-[45%] fixed hover:-left-5 active:-left-5 -left-10 z-101 btn btn-primary  btn-lg opacity-40 hover:opacity-100 active:opacity-100 transition-all duration-200"
              onClick={() => setShowThread(false)}
            >
              <MoveDownLeft size={20} className="ml-5 -mr-4 " />
            </button>
            <MessageThread
              currentUserId={currentUserId}
              recipientId={recipientId}
              recipientInfo={recipientInfo}
              onClearThread={() => {
                setRecipientId(null);
                setRecipientInfo(null);
                setShowThread(false); // Return to conversation list
              }}
            />
          </>
        ) : (
          <p className="text-base-content/70 italic">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
