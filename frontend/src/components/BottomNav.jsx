// src/components/BottomNav.jsx
import { Home, Upload, Compass, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/explore", icon: <Compass size={20} />, label: "Explore" },
  { to: "/upload", icon: <Upload size={20} />, label: "Upload" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg border-t border-secondary text-text">
      <nav className="flex justify-between px-4 py-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-1 
                ${isActive ? "text-primary" : "hover:text-secondary"}`
            }
          >
            {icon}
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
