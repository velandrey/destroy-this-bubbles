import path from 'path';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: Number(process.env.CLIENT_PORT) || 3000,
    },
    define: {
        __EXTERNAL_SERVER_URL__: JSON.stringify(
            process.env.EXTERNAL_SERVER_URL
        ),
        __INTERNAL_SERVER_URL__: JSON.stringify(
            process.env.INTERNAL_SERVER_URL
        ),
    },
    build: {
        outDir: path.join(__dirname, 'dist/client'),
    },
    ssr: {
        format: 'cjs',
    },
    plugins: [react()],
});
