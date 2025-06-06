import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "../PostCard";
import Loader from "../../components/Loader"; // Adjust the import path as necessary

export default function MessageThread({
  recipientId,
  currentUserId,
  recipientInfo,
  onClearThread, // NEW PROP
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false); // NEW STATE FOR LOADING

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/messages/conversation/${recipientId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setMessages(data);
  }, [recipientId]);

  // Polling for new messages
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 1500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return;
    setSending(true); // SET LOADING TO TRUE
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        recipientId,
        text,
      }),
    });
    const newMessage = await res.json();
    setSending(false); // SET LOADING TO FALSE
    // Ensure sender is an object for immediate styling
    const formattedMessage = {
      ...newMessage,
      sender: { _id: currentUserId },
    };
    setMessages((prev) => [...prev, formattedMessage]);
    setText("");
  };

  // Get recipient username from messages
  let recipientUsername = "";
  if (messages.length > 0) {
    const firstMsg = messages[0];
    if (firstMsg.sender && firstMsg.sender._id !== currentUserId) {
      recipientUsername = firstMsg.sender.username;
    } else if (firstMsg.recipient && firstMsg.recipient._id !== currentUserId) {
      recipientUsername = firstMsg.recipient.username;
    }
  }

  // Clear messages if recipientId changes (e.g., conversation is deleted)
  useEffect(() => {
    if (!recipientId) {
      setMessages([]); // Clear messages when recipientId is null
    }
  }, [recipientId]);

  return (
    <div className="flex flex-col h-full">
      <div className=" text-lg font-bold border-b border-base-300 bg-base-100  flex items-center gap-2 z-100 w-full">
        {recipientInfo?.avatar && (
          <img
            src={recipientInfo.avatar}
            alt={recipientInfo.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span>{recipientInfo?.username || "Conversation"}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => {
          const isMine =
            (msg.sender && msg.sender._id === currentUserId) ||
            msg.sender === currentUserId;
          return (
            <div
              key={msg._id}
              className={`max-w-xs px-3 py-2 rounded-2xl ${
                isMine
                  ? "ml-auto bg-primary text-primary-content "
                  : "mr-auto bg-base-200 text-base-content"
              }`}
            >
              <p>{msg.text}</p>
              {msg.post && <PostCard post={msg.post} />}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 z-10 bg-base-100 p-2 flex mt-10">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input input-bordered w-full rounded-r-none border-r-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary rounded-l-none"
          disabled={!text.trim()}
        >
          {sending ? <Loader type="spinner" size="sm" /> : "Send"}
        </button>
      </div>
    </div>
  );
}
