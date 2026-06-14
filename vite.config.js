import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        colorbends: resolve(__dirname, "colorbends-test.html"),
        liquid: resolve(__dirname, "liquid-test.html")
      }
    }
  }
});
