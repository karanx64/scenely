// src/components/BottomNav.jsx
import {
  Home,
  Upload,
  Compass,
  User,
  Settings,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/explore", icon: <Compass size={20} />, label: "Explore" },
  { to: "/upload", icon: <Upload size={20} />, label: "Upload" },

  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/messages", icon: <MessageCircle size={20} />, label: "Messsages" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-base-100 border-t border-base-300 text-base-content">
      <nav className="flex justify-between px-4 py-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 gap-0.5 py-1 transition-colors ${
                isActive ? "text-primary" : "hover:text-secondary"
              }`
            }
          >
            {icon}
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
