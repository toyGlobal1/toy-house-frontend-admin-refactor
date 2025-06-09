import { HomeIcon } from "lucide-react";
import { Link } from "react-router";
import Logo from "../components/Logo";

const DASHBOARD_NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { title: "Orders", href: "/order", icon: HomeIcon },
  { title: "Products", href: "/product", icon: HomeIcon },
];

export default function DashboardSidebar() {
  return (
    <aside className="max-h-screen w-[13vw] border-r-2 bg-content1 p-3">
      <Logo className="mx-auto mb-5" />
      <nav>
        <ul className="space-y-3">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-default">
                <item.icon className="size-5" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
