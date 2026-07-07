import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // stats-gl (via drei) pulls its own three copy in dev without this
    dedupe: ['three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // keep the 3D stack out of the initial bundle path (budget: ≤900KB initial JS)
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
  },
});
