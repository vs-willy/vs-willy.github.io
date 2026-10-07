import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/onest";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import { App } from "./App";

// Тема по умолчанию светлая, выбор из дока запоминается
try {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
} catch {
  /* без localStorage остается светлая */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
