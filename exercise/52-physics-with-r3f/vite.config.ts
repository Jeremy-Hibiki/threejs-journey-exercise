import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: 'src/',
  publicDir: '../public/',
  base: './',
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
