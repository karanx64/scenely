import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import PostCard from "../PostCard";
import Loader from "../Loader";

export default function MessageThread({
  recipientId,
  currentUserId,
  recipientInfo,
  onClearThread,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages and set up real-time subscription
  useEffect(() => {
    if (!recipientId || !currentUserId) return;

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`conversation-${currentUserId}-${recipientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Only add if message is part of this conversation
          const newMsg = payload.new;
          const isRelevant =
            (newMsg.sender_id === currentUserId &&
              newMsg.recipient_id === recipientId) ||
            (newMsg.sender_id === recipientId &&
              newMsg.recipient_id === currentUserId);

          if (isRelevant) {
            // Fetch full message with user data
            fetchSingleMessage(newMsg.id);
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, currentUserId]);

  const fetchSingleMessage = async (messageId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
        *,
        sender:users!messages_sender_id_fkey(id, username, avatar),
        recipient:users!messages_recipient_id_fkey(id, username, avatar),
        post:posts(id, image_urls, caption, emoji, media)
      `,
        )
        .eq("id", messageId)
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    } catch (err) {
      console.error("Error fetching single message:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users!messages_sender_id_fkey(id, username, avatar),
          recipient:users!messages_recipient_id_fkey(id, username, avatar),
          post:posts(id, image_urls, caption, emoji, media)
        `,
        )
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    setSending(true);

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          recipient_id: recipientId,
          text: text.trim(),
        })
        .select(
          `
          *,
          sender:users!messages_sender_id_fkey(id, username, avatar),
          recipient:users!messages_recipient_id_fkey(id, username, avatar)
        `,
        )
        .single();

      if (error) throw error;

      // Message will be added via real-time subscription
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Clear messages if recipientId changes
  useEffect(() => {
    if (!recipientId) {
      setMessages([]);
    }
  }, [recipientId]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-lg font-bold border-b border-base-300 bg-base-100 flex items-center gap-2 p-3">
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
          const isMine = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`max-w-xs px-3 py-2 rounded-2xl ${
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

      <div className="sticky bottom-0 bg-base-100 p-2 flex border-t border-base-300">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered w-full rounded-r-none border-r-0"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary rounded-l-none"
          disabled={!text.trim() || sending}
        >
          {sending ? <Loader type="spinner" size="sm" /> : "Send"}
        </button>
      </div>
    </div>
  );
}
