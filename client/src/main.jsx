import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./i18n";
// Police hébergée avec le site (plus rapide et sans dépendance à Google Fonts).
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import "./media.css";
import "./admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
