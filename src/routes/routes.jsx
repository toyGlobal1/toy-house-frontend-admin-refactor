import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import BrandPage from "../pages/brand/BrandPage";
import CategoryPage from "../pages/category/CategoryPage";
import ColorPage from "../pages/color/ColorPage";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import MaterialsPage from "../pages/material/MaterialsPage";
import OrderPage from "../pages/order/OrderPage";
import AddProductPage from "../pages/product/AddProductPage";
import ProductInventoryPage from "../pages/product/ProductInventoryPage";
import ProductPage from "../pages/product/ProductPage";
import ProductUpdatePage from "../pages/product/ProductUpdatePage";
import ReviewPage from "../pages/review/ReviewPage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage, errorElement: <ErrorPage /> },
  {
    path: "/",
    Component: DashboardLayout,
    errorElement: <ErrorPage />,
    children: [
      { path: "/dashboard", Component: DashboardPage },
      { path: "/order", Component: OrderPage },
      { path: "/product", Component: ProductPage },
      { path: "/product/add", Component: AddProductPage },
      { path: "/product/:id", Component: ProductInventoryPage },
      { path: "/product/:id/update", Component: ProductUpdatePage },
      { path: "/category", Component: CategoryPage },
      { path: "/brand", Component: BrandPage },
      { path: "/color", Component: ColorPage },
      { path: "/material", Component: MaterialsPage },
      { path: "/review", Component: ReviewPage },
    ],
  },
]);
