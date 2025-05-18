// Frontend code

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './client/src'),
//             '@lib': path.resolve(__dirname, './client/src/lib'),
//             '@shared': path.resolve(__dirname, './shared'),
//         },
//     },
// });








// Backend code
// vite.config.ts
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default defineConfig({
//     root: './client',
//     resolve: {
//         alias: {
//             '@': resolve(__dirname, './client/src'),
//         },
//     },
//     plugins: [react()],
// });


// ------------------

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


// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';

// // Emulate __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default {
//     // Example of resolving paths with the fixed __dirname
//     resolve: {
//         alias: {
//             '@': resolve(__dirname, './client/src'),
//         },
//     },
// };
