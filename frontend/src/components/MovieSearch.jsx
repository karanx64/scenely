import { useState } from "react";
import axios from "axios";

const MovieSearch = ({ media, setMedia }) => {
  const [mediaResults, setMediaResults] = useState([]);

  const handleMediaSearch = async (title) => {
    setMedia((prev) => ({ ...prev, title }));
    if (title.length < 2) return;

    try {
      const res = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
        params: {
          query: title,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`,
        },
      });

      const results = res.data.results
        .filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        )
        .slice(0, 5);

      setMediaResults(results);
    } catch (err) {
      console.error("TMDB search error:", err);
      setMediaResults([]);
    }
  };

  const clearResults = () => {
    setMedia((prev) => ({
      ...prev,
      title: "",
      tmdbId: "",
      type: "",
      date: "",
    }));
    setMediaResults([]);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={media.title}
        onChange={(e) => handleMediaSearch(e.target.value)}
        placeholder="Enter movie or series name"
        className="input input-bordered w-full"
      />
      <button onClick={clearResults} className="btn btn-error btn-sm">
        Clear
      </button>
      {mediaResults.length > 0 && (
        <ul className="bg-base-100 border border-base-300 rounded-lg shadow max-h-40 overflow-y-auto">
          {mediaResults.map((item) => (
            <li
              key={item.id}
              className="px-3 py-2 cursor-pointer hover:bg-base-200"
              onClick={() => {
                setMedia({
                  title: item.title || item.name,
                  tmdbId: item.id,
                  type: item.media_type,
                  year: item.release_date
                    ? item.release_date.slice(0, 4)
                    : "N/A", // Correctly extract year
                });
                setMediaResults([]);
              }}
            >
              {item.title || item.name}{" "}
              <span className="text-sm opacity-70">({item.media_type})</span>
              {item.release_date && (
                <span className="text-sm opacity-70">
                  {" "}
                  ({item.release_date.slice(0, 4)})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
