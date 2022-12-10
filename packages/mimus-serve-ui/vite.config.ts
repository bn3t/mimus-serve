/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ui/",
  build: {
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/__admin": "http://localhost:4000",
    },
  },
  plugins: [tsconfigPaths(), react()],
});
