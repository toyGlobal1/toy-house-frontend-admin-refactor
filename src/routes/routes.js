import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import OrderPage from "../pages/OrderPage";
import ProductPage from "../pages/product/ProductPage";
import AddProductPage from "../pages/AddProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { path: "/dashboard", Component: DashboardPage },
      { path: "/order", Component: OrderPage },
      { path: "/product", Component: ProductPage },
      { path: "/product/add", Component: AddProductPage },
    ],
  },
]);
