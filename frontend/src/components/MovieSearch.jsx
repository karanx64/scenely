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
    setMedia((prev) => ({ ...prev, title: "", tmdbId: "", type: "" }));
    setMediaResults([]);
  };

  return (
    <div>
      <input
        type="text"
        value={media.title}
        onChange={(e) => handleMediaSearch(e.target.value)}
        placeholder="Enter movie or series name"
        className="input input-bordered w-full"
      />
      <button onClick={clearResults} className="m-5 bg-red-500 rounded-sm">
        clear
      </button>
      {mediaResults.length > 0 && (
        <ul className="bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow">
          {mediaResults.map((item) => (
            <li
              key={item.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setMedia({
                  title: item.title || item.name,
                  tmdbId: item.id,
                  type: item.media_type,
                });
                setMediaResults([]);
              }}
            >
              {item.title || item.name} ({item.media_type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
