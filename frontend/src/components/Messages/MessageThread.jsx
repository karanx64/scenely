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
    <div>
      <div className="overflow-y-auto h-80">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={
              msg.sender === currentUserId ? "text-right" : "text-left"
            }
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
          className="border p-1 w-full"
        />
        <button onClick={sendMessage} className="btn">
          Send
        </button>
      </div>
    </div>
  );
}
