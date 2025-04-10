import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "node_modules"],
  },
});
