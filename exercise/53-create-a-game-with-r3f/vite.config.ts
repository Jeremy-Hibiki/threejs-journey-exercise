import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
    visualizer() as PluginOption,
  ],
  root: 'src/',
  publicDir: '../public/',
  base: './',
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['three', '@dimforge/rapier3d-compat'],
    },
  },
});
