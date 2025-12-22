import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    // Optimize chunk splitting (only for client build)
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          // Separate Three.js and related libraries into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'maath'],
          // Separate Framer Motion
          'framer': ['framer-motion'],
          // Separate i18n
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    // Use esbuild for minification (default, fast and efficient)
    minify: 'esbuild',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion'],
  },
}));
