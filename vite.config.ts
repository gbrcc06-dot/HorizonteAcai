import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => {
  const isReplit = process.env.REPL_ID !== undefined && mode !== "production";

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),

      // Só carrega plugins do Replit se realmente estiver no Replit
      ...(isReplit
        ? [
            require("@replit/vite-plugin-cartographer").cartographer(),
            require("@replit/vite-plugin-dev-banner").devBanner(),
          ]
        : []),
    ],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },

    root: path.resolve(import.meta.dirname, "client"),

    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },

    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
