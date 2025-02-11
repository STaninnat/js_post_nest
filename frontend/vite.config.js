/* eslint-env node */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_API_URL || "http://localhost:8080";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/v1": backendUrl,
      },
      host: true,
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
    build: {
      outDir: "dist",
    },
    test: {
      watch: false,
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
    },
    define: {
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
