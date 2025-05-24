// components/UserAvatar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserAvatar({
  size = 48,
  clickable = true,
  showTooltip = true,
}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (clickable && user?._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  const sizeClass = `w-[${size}px] h-[${size}px]`;

  return (
    <div
      className={`rounded-full overflow-hidden border border-gray-300 cursor-pointer`}
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
      ) : (
        <div
          className="bg-gray-200 flex items-center justify-center text-gray-500"
          style={{ width: size, height: size, fontSize: size / 2 }}
        >
          ?
        </div>
      )}
    </div>
  );
}
