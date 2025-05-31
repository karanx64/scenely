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
import Scenely from "../../src/assets/Scenely.png";
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="hidden md:flex h-screen bg-base-100 text-base-content shadow-md sticky top-0 left-0 ">
      <div
        className={`flex flex-col justify-evenly overflow-y-auto ${
          collapsed ? "w-20" : "w-60"
        } transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center btn focus:bg-transparent hover:bg-transparent bg-transparent border-none ">
          <NavLink to="/" className="flex items-center">
            <img src={Scenely} alt="Scenely Logo" width={50} />
            {!collapsed && (
              <h1 className="text-5xl font-bold text-primary ">cenely</h1>
            )}
          </NavLink>
        </div>

        {/* Navigation */}
        <div>
          <nav className="flex flex-col flex-">
            {/* {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 font-medium transition-colors rounded-r-4xl h-20 ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "hover:bg-secondary/50"
                  }`
                }
              >
                <div className="">{icon}</div>
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))} */}
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center gap-3 px-4 font-medium transition-colors rounded-r-4xl h-20  ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "hover:bg-secondary/50"
                  }`
                }
              >
                <div className="">{icon}</div>
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
            {/* Buttons */}
            <div className="flex flex-col">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="btn btn-ghost rounded-l-none rounded-r-4xl h-20 w-full"
              >
                {!collapsed ? (
                  <>
                    <ArrowLeftFromLine size={20} /> <p>Collapse</p>
                  </>
                ) : (
                  <>
                    <ArrowRightFromLine size={20} />
                  </>
                )}
              </button>
              <ThemeSwitcher
                className="btn-ghost rounded-l-none rounded-r-4xl h-20 w-full"
                collapsed={collapsed}
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
