import { ToastProvider } from "@heroui/react";
import { Outlet } from "react-router";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <ToastProvider />
      <DashboardSidebar />
      <main className="max-h-screen flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
