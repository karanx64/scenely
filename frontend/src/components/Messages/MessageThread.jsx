import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "../PostCard";

export default function MessageThread({
  recipientId,
  currentUserId,
  recipientInfo,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);

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

  // Detect user scroll to decide if we should auto-scroll on new messages
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If user is within 80px of the bottom, enable auto-scroll
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        80;
      setShouldScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    // Set initial scroll state
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom if shouldScroll is true (new messages from polling)
  useEffect(() => {
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScroll]);

  // Always scroll to bottom when sending a new message
  const sendMessage = async () => {
    if (!text.trim()) return;
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
    // Ensure sender is an object for immediate styling
    const formattedMessage = {
      ...newMessage,
      sender: { _id: currentUserId },
    };
    setMessages((prev) => [...prev, formattedMessage]);
    setText("");
    // Always scroll to bottom when sending
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
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

  return (
    <div className="flex flex-col h-full">
      <div
        className="overflow-y-auto h-80 px-2 space-y-2"
        ref={scrollContainerRef}
      >
        <div className="px-2 py-1 text-lg font-bold border-b border-base-300 bg-base-100 sticky top-0 z-10 flex items-center gap-2">
          {recipientInfo?.avatar && (
            <img
              src={recipientInfo.avatar}
              alt={recipientInfo.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{recipientInfo?.username || "Conversation"}</span>
        </div>

        {messages.map((msg) => {
          const isMine =
            (msg.sender && msg.sender._id === currentUserId) ||
            msg.sender === currentUserId;
          return (
            <div
              key={msg._id}
              className={`max-w-xs px-3 py-2 rounded-lg ${
                isMine
                  ? "ml-auto bg-primary text-primary-content"
                  : "mr-auto bg-base-200 text-base-content"
              }`}
            >
              <p>{msg.text}</p>
              {msg.post && <PostCard post={msg.post} />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input input-bordered w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
}
