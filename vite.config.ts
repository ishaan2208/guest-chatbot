import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// Rarely-changing runtime libraries pinned to one "vendor" chunk: UI-only
// deploys then leave its hash untouched, so returning guests (immutable CDN
// cache + the service worker's cache-first assets) skip re-downloading
// react/recoil/router entirely. Login-only libs (react-hook-form, zod) are
// deliberately NOT listed — they belong to the lazy login chunk.
const VENDOR_PACKAGES = new Set([
  "react",
  "react-dom",
  "scheduler",
  "react-router",
  "react-router-dom",
  "@remix-run/router",
  "recoil",
  "axios",
  "zustand",
]);

const packageOf = (id: string): string | undefined =>
  id.match(
    /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@[^/]+\/[^/]+|[^/]+)/
  )?.[1];

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  // Dev server: honor an assigned PORT (preview harness) and fall back to 3011.
  server: {
    port: Number(process.env.PORT) || 3011,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const pkg = packageOf(id);
          if (pkg && VENDOR_PACKAGES.has(pkg)) return "vendor";
        },
      },
    },
  },
});
