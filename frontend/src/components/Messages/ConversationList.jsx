import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import SearchUsers from "../SearchUsers";
import { Trash2 } from "lucide-react";
import Loader from "../Loader";

export default function ConversationList({ userId, onSelect, selectedId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetchConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `or(sender_id.eq.${userId},recipient_id.eq.${userId})`,
        },
        () => {
          // Refresh conversations when any message changes
          fetchConversations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users!messages_sender_id_fkey(id, username, avatar),
          recipient:users!messages_recipient_id_fkey(id, username, avatar),
          post:posts(id, image_urls, caption)
        `,
        )
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationsMap = new Map();

      data?.forEach((msg) => {
        if (!msg.sender || !msg.recipient) return;

        const otherUserId =
          msg.sender.id === userId ? msg.recipient.id : msg.sender.id;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, msg);
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  // THIS IS THE IMPORTANT FUNCTION - make sure it exists
  const handleStartConversation = (user) => {
    // user object from SearchUsers has { id, username, avatar, email }
    onSelect(user.id, user);
  };

  const handleDeleteConversation = async (participantId) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .or(
          `and(sender_id.eq.${userId},recipient_id.eq.${participantId}),and(sender_id.eq.${participantId},recipient_id.eq.${userId})`,
        );

      if (error) throw error;

      setConversations((prev) =>
        prev.filter((conv) => {
          const otherUserId =
            conv.sender?.id === userId ? conv.recipient?.id : conv.sender?.id;
          return otherUserId !== participantId;
        }),
      );

      if (participantId === selectedId) onSelect(null, null);
    } catch (err) {
      console.error("Delete conversation error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-base">
      <div className="p-2">
        <SearchUsers onUserSelect={handleStartConversation} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader type="spinner" size="md" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No conversations found.
          </p>
        ) : (
          <ul className="space-y-1 p-2">
            {conversations.map((conv) => {
              const participant =
                conv.sender && conv.sender.id === userId
                  ? conv.recipient
                  : conv.sender;

              if (!participant) return null;

              return (
                <li
                  key={participant.id}
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-base-200 ${
                    selectedId === participant.id ? "bg-base-300" : ""
                  }`}
                  onClick={() => onSelect(participant.id, participant)}
                >
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{participant.username}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.text || "Shared a post"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(participant.id);
                    }}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
