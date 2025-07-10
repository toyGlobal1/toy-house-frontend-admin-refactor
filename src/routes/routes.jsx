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
import AuthRoute from "./AuthRoute";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute />,
    children: [{ path: "/", element: <HomePage />, errorElement: <ErrorPage /> }],
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        errorElement: <ErrorPage />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/order", element: <OrderPage /> },
          { path: "/product", element: <ProductPage /> },
          { path: "/product/add", element: <AddProductPage /> },
          { path: "/product/:id", element: <ProductInventoryPage /> },
          { path: "/product/:id/update", element: <ProductUpdatePage /> },
          { path: "/category", element: <CategoryPage /> },
          { path: "/brand", element: <BrandPage /> },
          { path: "/color", element: <ColorPage /> },
          { path: "/material", element: <MaterialsPage /> },
          { path: "/review", element: <ReviewPage /> },
        ],
      },
    ],
  },
]);
