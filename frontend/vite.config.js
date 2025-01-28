import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": "http://localhost:8080",
    },
    sourcemap: true,
  },
  build: {
    sourcemap: false,
  },
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
