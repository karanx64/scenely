import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dim"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dim" ? "dimDark" : "dim"));
  };

  return (
    <button onClick={toggleTheme} className="btn btn-ghost">
      {theme === "dim" ? <Moon size={20} /> : <Sun size={20} />}
      <span className="ml-2 hidden sm:inline">
        {theme === "dim" ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
