// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen text-base-content bg-base-100">
      {/* Sidebar (shown on md+) */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Page content scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-20 md:pb-6 p-50">
          <Outlet />
        </div>

        {/* Bottom nav (only on mobile) */}
        <BottomNav />
      </div>
    </div>
  );
}
