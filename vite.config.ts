import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
// Importações necessárias para usar __dirname em ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname para o escopo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        // Agora usamos __dirname em vez de import.meta.dirname
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    root: path.resolve(__dirname, "client"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
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
