// src/components/SearchUsers.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (!query.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/search?name=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Search failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearResults = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return (
    <div className="p-4 rounded w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex mb-10">
        <input
          type="text"
          placeholder="Search users by name..."
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={clearResults}
        >
          Clear
        </button>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {error && <p className="text-error mb-2">{error}</p>}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => navigate(`/user/${user._id}`)}
              className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {user.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
