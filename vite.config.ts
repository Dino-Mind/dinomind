import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import path from 'path';
import tailwindcss from "tailwindcss";


import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as unknown as ManifestV3Export }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        options: "options.html",
      },
    },
  },
  css: {
    postcss: {
     plugins: [tailwindcss()],
    },
   },
  resolve: {
    alias: {
   "@": path.resolve(__dirname, "./src"),
  },
},
});
