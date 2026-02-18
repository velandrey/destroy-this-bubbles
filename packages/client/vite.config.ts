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
                            src: '/favicon-16x16.png',
                            sizes: '16x16',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-32x32.png',
                            sizes: '32x32',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-57x57.png',
                            sizes: '57x57',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-60x60.png',
                            sizes: '60x60',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-72x72.png',
                            sizes: '72x72',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-76x76.png',
                            sizes: '76x76',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-96x96.png',
                            sizes: '96x96',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-114x114.png',
                            sizes: '114x114',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-120x120.png',
                            sizes: '120x120',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-144x144.png',
                            sizes: '144x144',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-152x152.png',
                            sizes: '152x152',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-180x180.png',
                            sizes: '180x180',
                            type: 'image/png',
                        },
                        {
                            src: '/favicon-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'any',
                        },
                        {
                            src: '/favicon-192x192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'maskable',
                        },
                    ],
                },
            }),
        ],
    };
});
