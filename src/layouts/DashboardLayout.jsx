import { Outlet } from "react-router";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
