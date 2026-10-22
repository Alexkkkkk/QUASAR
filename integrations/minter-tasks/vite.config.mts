import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(rootDir, "src");
const aliases = [
  "App",
  "assets",
  "components",
  "consts",
  "helpers",
  "hooks",
  "lib",
  "pages",
  "services",
  "store",
  "theme",
  "utils",
];

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: aliases.map((name) => ({
      find: new RegExp(`^${name}(?=/|$)`),
      replacement: resolve(srcDir, name),
    })),
  },
  define: {
    "process.env.REACT_APP_DEPLOY_QUERY_ID": JSON.stringify(process.env.REACT_APP_DEPLOY_QUERY_ID ?? "0"),
  },
  server: { host: "0.0.0.0" },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
  },
});
