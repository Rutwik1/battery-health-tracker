import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './client', // Point to the directory containing index.html
  plugins: [react()],
  build: {
    outDir: '../dist', // Output to the dist folder in the project root
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets')
    }
  }
});