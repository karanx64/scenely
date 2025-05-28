// src/components/Sidebar.jsx
import {
  Home,
  Upload,
  Compass,
  User,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/explore", icon: <Compass size={20} />, label: "Explore" },
  { to: "/upload", icon: <Upload size={20} />, label: "Upload" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
];

export default function Sidebar() {
  //logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="hidden md:flex h-screen w-60 bg-base-100 text-base-content flex-col shadow-md p-6 sticky top-0 left-0 justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-primary">Scenely</h1>

        <nav className="flex flex-col gap-3">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-secondary/20"
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-error hover:bg-error/10"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
