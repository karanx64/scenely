import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function UserAvatar({
  size = 48,
  clickable = true,
  showTooltip = true,
}) {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("username, avatar")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = () => {
    if (!clickable || !authUser) return;

    // Go to /select-avatar if already on /profile, else go to user profile
    if (location.pathname.startsWith("/profile")) {
      navigate("/select-avatar");
    } else {
      navigate(`/profile`);
    }
  };

  const username =
    userProfile?.username || authUser?.email?.split("@")[0] || "User";
  const avatarUrl = userProfile?.avatar;

  return (
    <div
      className={`rounded-full overflow-hidden border border-gray-300 aspect-square ${
        clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
      style={{ width: size, height: size }}
      onClick={handleClick}
      title={showTooltip && username ? username : ""}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : authUser ? (
        <div
          className="bg-gray-300 text-gray-700 flex items-center justify-center font-bold w-full h-full"
          style={{ fontSize: size / 2 }}
        >
          {getInitials(username)}
        </div>
      ) : (
        <div className="bg-gray-100 flex items-center justify-center text-gray-400 w-full h-full">
          ...
        </div>
      )}
    </div>
  );
}
