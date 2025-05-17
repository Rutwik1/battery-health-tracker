import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    root: './client',  // Set root folder here
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './client/src'),
        },
    },
});
