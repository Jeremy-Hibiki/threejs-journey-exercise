import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',
  css: {
    postcss: {
      plugins: [autoprefixer, postcssNesting],
    },
  },
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
