import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './client', // This points to where your index.html is
  build: {
    outDir: '../dist', // Output to dist folder in project root
    emptyOutDir: true
  },
  plugins: [react()]
});