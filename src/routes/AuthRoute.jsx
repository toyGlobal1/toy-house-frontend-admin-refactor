import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function AuthRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const authRoutes = ["/"];

  const isAuthRoute = authRoutes.includes(pathname);

  return isAuthenticated && isAuthRoute ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
