import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function UserAvatar({
  size = 48,
  clickable = true,
  showTooltip = true,
}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUser();
  }, []);

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
    if (!clickable || !user) return;

    // Go to /select-avatar if already on /profile, else go to user profile
    if (location.pathname.startsWith("/profile")) {
      navigate("/select-avatar");
    } else {
      navigate(`/profile/${user._id}`);
    }
  };
  

  return (
    <div
      className={`rounded-full overflow-hidden border border-gray-300 aspect-square ${
        clickable ? "cursor-pointer" : ""
      }`}
      style={{ width: size, height: size }}
      onClick={handleClick}
      title={showTooltip && user?.username ? user.username : ""}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : user ? (
        <div
          className="bg-gray-300 text-gray-700 flex items-center justify-center font-bold w-full h-full"
          style={{ fontSize: size / 2 }}
        >
          {getInitials(user.username)}
        </div>
      ) : (
        <div className="bg-gray-100 flex items-center justify-center text-gray-400 w-full h-full">
          ...
        </div>
      )}
    </div>
  );
}
