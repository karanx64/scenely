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
    <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-lg w-96 max-h-[80vh] overflow-y-auto relative ring-1 ring-base-300">
        <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-base-content hover:text-error text-xl"
        >
          ✕
        </button>

        {users.length === 0 ? (
          <p className="text-sm text-base-content/70">No {type} yet.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user._id} className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-neutral text-neutral-content rounded-full flex items-center justify-center text-sm font-bold">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-sm">{user.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
