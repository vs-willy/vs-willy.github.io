import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/onest";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/jetbrains-mono";
import "@xyflow/react/dist/base.css";
import "./index.css";
import { App } from "./App";
import { initSmoothAnchors } from "./smoothAnchors";

initSmoothAnchors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
