import react from '@vitejs/plugin-react';
import postcssNesting from 'postcss-nesting';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: 'src/',
  publicDir: '../public/',
  base: './',
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
