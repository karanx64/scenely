import { useEffect, useState, useRef } from "react";
import PostCard from "../PostCard";

export default function MessageThread({ recipientId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messageSendRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const fetchMessages = async () => {
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
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 1500);
    return () => clearInterval(interval);
  }, [recipientId]);

  // Detect user scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If user is within 80px of the bottom, enable auto-scroll
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        80;
      setAutoScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom if autoScroll is enabled
  useEffect(() => {
    if (autoScroll) {
      messageSendRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const sendMessage = async () => {
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
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="overflow-y-auto h-80 px-2 space-y-2"
        ref={scrollContainerRef}
      >
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
        <div ref={messageSendRef} />
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
