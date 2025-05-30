// src/components/Sidebar.jsx
import {
  Home,
  Upload,
  Compass,
  User,
  Settings,
  MessageCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import Scenely from "../../public/scenely.png";

const navItems = [
  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/explore", icon: <Compass size={20} />, label: "Explore" },
  { to: "/upload", icon: <Upload size={20} />, label: "Upload" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex h-screen w-50 bg-base-100 text-base-content flex-col shadow-md p-6 sticky top-0 left-0 justify-between ">
      <div className="flex flex-col mb-10">
        <NavLink
          to="/"
          className="text-4xl font-bold text-primary h-20 text-center flex items-center justify-center"
        >
          <div className="flex items-center ">
            <img src={Scenely} alt="" width={30} />
            <h1>cenely</h1>
          </div>
        </NavLink>
      </div>

      <div>
        <nav className="flex flex-col">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3  h-20  font-medium transition-colors rounded-r-4xl ml-20 ${
                  isActive
                    ? "bg-primary text-primary-content "
                    : "hover:bg-secondary/50"
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col">
        <ThemeSwitcher className="rounded-l-none rounded-r-4xl mb-10 h-20" />
      </div>
    </div>
  );
}
