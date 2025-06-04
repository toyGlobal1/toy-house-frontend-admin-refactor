import { HeroUIProvider } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { TanstackQueryProvider } from "./contexts/TanstackQueryProvider.jsx";
import "./index.css";
import { router } from "./routes/routes.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <TanstackQueryProvider>
        <RouterProvider router={router} />
      </TanstackQueryProvider>
    </HeroUIProvider>
  </StrictMode>
);
