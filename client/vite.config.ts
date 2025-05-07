import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      '/file': {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      '/oauth2': {
        target: "http://localhost:8080",
        changeOrigin: true
      },
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // if (id.includes("axios")) {
          //   return "@networking-vendor";
          // }
          if (id.includes("prosemirror") || id.includes("prismjs")) {
            return "@code-plugin";
          }
          if (id.includes("toast-ui")) {
            let prefix = '';

            if (id.includes("editor-plugin-"))
              prefix = "-plugin";
            else if (id.includes("editor-viewer"))
              prefix = "-viewer";

            return `@toast-ui${prefix}`;
          }
          if (id.includes("katex")) {
            return "@katex";
          }
          // if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-redux")) {
          //   return "@react-vendor";
          // }
        }
      }
    }
  }
})
