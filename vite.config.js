import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "assets",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: "input.tailwind.css",
      output: {
        assetFileNames: "tailwind.css",
      },
    },
  },
});
