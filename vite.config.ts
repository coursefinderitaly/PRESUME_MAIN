import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) return 'animation-vendor';
          if (id.includes('react')) return 'react-vendor';
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  // Pre-bundle frequently used libs to speed up dev server HMR
  optimizeDeps: {
    include: ['framer-motion', 'gsap', 'lenis', '@use-gesture/react'],
  },
})