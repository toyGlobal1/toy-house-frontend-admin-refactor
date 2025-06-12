import { ToastProvider } from "@heroui/react";
import { Suspense } from "react";
import { Outlet } from "react-router";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex max-h-screen">
      <ToastProvider />
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-4">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
