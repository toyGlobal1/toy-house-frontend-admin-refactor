import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import AddProductPage from "../pages/AddProductPage";
import BrandPage from "../pages/brand/BrandPage";
import CategoryPage from "../pages/category/CategoryPage";
import ColorPage from "../pages/color/ColorPage";
import DashboardPage from "../pages/DashboardPage";
import MaterialsPage from "../pages/material/MaterialsPage";
import OrderPage from "../pages/OrderPage";
import ProductInventoryPage from "../pages/product/ProductInventoryPage";
import ProductPage from "../pages/product/ProductPage";
import ReviewPage from "../pages/review/ReviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { path: "/dashboard", Component: DashboardPage },
      { path: "/order", Component: OrderPage },
      { path: "/product", Component: ProductPage },
      { path: "/product/add", Component: AddProductPage },
      { path: "/product/:id", Component: ProductInventoryPage },
      { path: "/category", Component: CategoryPage },
      { path: "/brand", Component: BrandPage },
      { path: "/color", Component: ColorPage },
      { path: "/material", Component: MaterialsPage },
      { path: "/review", Component: ReviewPage },
    ],
  },
]);
