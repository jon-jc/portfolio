import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// .mts so the config loads as ESM rather than being parsed as CommonJS.
// Vitest 4 transforms with oxc, which resolves the JSX runtime on its own —
// setting esbuild.jsx here is ignored and only produces a warning.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
