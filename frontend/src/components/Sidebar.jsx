// src/components/Sidebar.jsx
import {
  Home,
  Upload,
  Compass,
  User,
  Settings,
  MessageCircle,
  ArrowLeftFromLine,
  ArrowRightFromLine,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import Scenely from "../../public/scenely.png";
import { useState } from "react";

const navItems = [
  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/explore", icon: <Compass size={20} />, label: "Explore" },
  { to: "/upload", icon: <Upload size={20} />, label: "Upload" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false); // State for collapsed sidebar

  return (
    <div className="hidden md:flex h-screen bg-base-100 text-base-content flex-col shadow-md sticky top-0 left-0">
      {/* Sidebar content */}
      <div
        className={`flex flex-col ${
          collapsed ? "w-20" : "w-60"
        } transition-all duration-300`}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className={`text-4xl font-bold text-primary h-20 text-center flex items-center justify-center ${
            collapsed ? "hidden" : "block"
          }`}
        >
          <div className="flex items-center">
            <img src={Scenely} alt="Scenely Logo" width={30} />
            <h1>cenely</h1>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 h-12 px-4 font-medium transition-colors rounded-r-4xl ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-secondary/50"
                }`
              }
            >
              {icon}
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-outline mt-4 mx-auto"
        >
          {collapsed ? (
            <ArrowRightFromLine size={20} />
          ) : (
            <ArrowLeftFromLine size={20} />
          )}
        </button>

        {/* Theme Switcher */}
        <div className="mt-auto">
          <ThemeSwitcher className="rounded-l-none rounded-r-4xl mb-10 h-20" />
        </div>
      </div>
    </div>
  );
}
