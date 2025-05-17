// Frontend code

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//     root: './client',  // Set root folder here
//     plugins: [react()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './client/src'),
//         },
//     },
// });


// Backend code
// vite.config.ts
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: './client',
    resolve: {
        alias: {
            '@': resolve(__dirname, './client/src'),
        },
    },
    plugins: [react()],
});



