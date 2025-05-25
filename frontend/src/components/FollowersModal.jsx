import { useEffect, useState } from "react";

export default function FollowersModal({ userId, type, onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userId}/${type}`
        );
        const data = await res.json();
        setUsers(data); // data is already the array of users
      } catch (err) {
        console.error("Failed to fetch followers/following", err);
      }
    };

    fetchUsers();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-10 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        {users.length === 0 ? (
          <p>No {type} yet.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user._id} className="mb-2 flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mb-4">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
