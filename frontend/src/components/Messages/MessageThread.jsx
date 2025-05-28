// MessageThread.jsx
import { useEffect, useState } from "react";
import PostCard from "../PostCard"; // if you want to show shared posts

export default function MessageThread({ currentUserId, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
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
    fetchMessages();
  }, [recipientId]);

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
    setMessages((prev) => [...prev, newMessage]);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto h-80 px-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.sender === currentUserId
                ? "ml-auto bg-primary text-primary-content"
                : "mr-auto bg-base-200 text-base-content"
            }`}
          >
            <p>{msg.text}</p>
            {msg.post && <PostCard post={msg.post} />}
          </div>
        ))}
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
