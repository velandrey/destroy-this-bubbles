import path from 'path';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

dotenv.config();

export default defineConfig(async () => {
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    return {
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
        ssr: {
            format: 'cjs' as const,
        },
        build: {
            outDir: path.join(__dirname, 'dist/client'),
        },
        plugins: [
            react(),
            tsconfigPaths(),
            VitePWA({
                strategies: 'injectManifest',
                srcDir: 'src',
                filename: 'sw.js',
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: true,
                },
                manifest: {
                    name: 'Destroy This Bubbles',
                    short_name: 'Bubbles',
                    description: 'A simple bubble popping game',
                    theme_color: '#ffffff',
                    icons: [
                        {
                            src: 'vite.svg',
                            sizes: 'any',
                            type: 'image/svg+xml',
                            purpose: 'any maskable',
                        },
                    ],
                },
            }),
        ],
    };
});
