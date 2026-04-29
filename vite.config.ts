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
        manualChunks: {
          // Split heavy 3D/WebGL libraries into their own chunk — only loads with WhyChooseUs
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Animation libraries
          'animation-vendor': ['framer-motion', 'gsap', 'lenis'],
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
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