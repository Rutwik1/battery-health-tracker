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
//             "@shared/*": ["./shared/*"],
//             "@assets/*": ["./attached_assets/*"]
//         },
//     },
//     plugins: [react()],
// });


// --------------


// new code for both

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always resolve @ to ./client/src
const clientSrcPath = path.resolve(__dirname, './client/src');

export default defineConfig({
    root: './client', // Keep client root
    plugins: [react()],
    resolve: {
        alias: {
            '@': clientSrcPath,
            '@shared': path.resolve(__dirname, 'shared'),
        },
    },
});
