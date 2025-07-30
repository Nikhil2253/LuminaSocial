import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routing/router.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SideBarProvider } from "./contexts/SideBarContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <SideBarProvider>
          <RouterProvider router={router} />
        </SideBarProvider>
      </AuthProvider>
  </StrictMode>
);
