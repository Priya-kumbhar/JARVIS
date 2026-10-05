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
    include: ["pixi.js", "pixi-live2d-display", "pixi-live2d-display/cubism4"],
  },
  build: {
    commonjsOptions: {
      include: [/pixi\.js/, /pixi-live2d-display/, /node_modules/],
    },
  },
});
