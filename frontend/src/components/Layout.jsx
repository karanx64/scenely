import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:pl-60 pb-16 md:pb-0 bg-base-100 min-h-screen">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
