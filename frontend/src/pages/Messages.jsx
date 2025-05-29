// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import ConversationList from "../components/Messages/ConversationList";
// import MessageThread from "../components/Messages/MessageThread";

// export default function Messages() {
//   const [recipientId, setRecipientId] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [searchParams] = useSearchParams();

//   // Restore recipientId from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("selectedRecipientId");
//     if (stored) setRecipientId(stored);
//   }, []);

//   useEffect(() => {
//     const getMe = async () => {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const data = await res.json();
//       setCurrentUserId(data._id);
//     };
//     getMe();
//   }, []);

//   // Auto-select recipient from query param
//   useEffect(() => {
//     const userParam = searchParams.get("user");
//     if (userParam) setRecipientId(userParam);
//   }, [searchParams]);

//   // Persist recipientId to localStorage whenever it changes
//   useEffect(() => {
//     if (recipientId) {
//       localStorage.setItem("selectedRecipientId", recipientId);
//     }
//   }, [recipientId]);

//   return (
//     <div className="flex h-full border border-base-300 rounded-lg overflow-hidden">
//       <div className="w-1/3 border-r border-base-300">
//         <ConversationList
//           userId={currentUserId}
//           onSelect={setRecipientId}
//           selectedId={recipientId}
//         />
//       </div>
//       <div className="w-2/3 p-4 bg-base-100">
//         {recipientId ? (
//           <MessageThread
//             currentUserId={currentUserId}
//             recipientId={recipientId}
//           />
//         ) : (
//           <p className="text-base-content/70 italic">Select a conversation</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationList from "../components/Messages/ConversationList";
import MessageThread from "../components/Messages/MessageThread";

export default function Messages() {
  const [recipientId, setRecipientId] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null); // NEW
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchParams] = useSearchParams();

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
    <div className="flex h-full border border-base-300 rounded-lg overflow-hidden">
      <div className="w-1/3 border-r border-base-300">
        <ConversationList
          userId={currentUserId}
          onSelect={(id, info) => {
            setRecipientId(id);
            setRecipientInfo(info);
          }}
          selectedId={recipientId}
        />
      </div>
      <div className="w-2/3 p-4 bg-base-100">
        {recipientId ? (
          <MessageThread
            currentUserId={currentUserId}
            recipientId={recipientId}
            recipientInfo={recipientInfo}
          />
        ) : (
          <p className="text-base-content/70 italic">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
