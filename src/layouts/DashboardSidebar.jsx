import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaBox, FaBoxOpen, FaTools } from "react-icons/fa";
import { IoColorPalette } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { MdDashboard, MdRateReview } from "react-icons/md";
import { TbBrandCtemplar } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router";
import Logo from "../components/Logo";

const DASHBOARD_NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: MdDashboard },
  { title: "Orders", href: "/order", icon: FaBoxOpen },
  { title: "Products", href: "/product", icon: FaBox },
  { title: "Categories", href: "/category", icon: BiSolidCategoryAlt },
  { title: "Brands", href: "/brand", icon: TbBrandCtemplar },
  { title: "Colors", href: "/color", icon: IoColorPalette },
  { title: "Materials", href: "/material", icon: FaTools },
  { title: "Reviews", href: "/review", icon: MdRateReview },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="flex min-h-screen w-[13vw] flex-col border-r-2 bg-content1 pt-2">
      <Logo className="mx-auto mb-5" />
      <nav className="flex-1 border-t p-2">
        <ul className="space-y-3">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                style={({ isActive }) => ({
                  backgroundColor: isActive && "hsl(var(--heroui-default-700))",
                  color: isActive && "hsl(var(--heroui-default-200))",
                  fontWeight: isActive ? "500" : "normal",
                })}
                className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-default">
                <item.icon className="size-5" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-2">
        <button
          className="inline-flex w-full items-center gap-2 rounded-md px-3 py-1 font-medium text-danger/80 hover:bg-default"
          onClick={handleLogout}>
          <LuLogOut className="size-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
