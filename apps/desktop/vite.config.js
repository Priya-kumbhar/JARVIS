import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
  base: "./",
  optimizeDeps: {
    // Pixi.js v7 is CJS-first; Vite must pre-bundle it properly
    include: ["pixi.js", "pixi-live2d-display"],
  },
  build: {
    commonjsOptions: {
      // Allow Vite to transform Pixi's CJS require() calls
      include: [/pixi\.js/, /pixi-live2d-display/, /node_modules/],
    },
  },
});
