import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Сайт живет в корне https://vs-willy.github.io/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
});
