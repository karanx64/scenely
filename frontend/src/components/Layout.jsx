import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex bg-base-100 min-h-screen text-base-content">
      <Sidebar />
      <div className="flex-1 md:ml-60 pb-16 md:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
