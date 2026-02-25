import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          himnos: ['./src/data/himnos.json'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['fonts/*.ttf', 'icon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Himnos',
        short_name: 'Himnos',
        description: 'Himnario de Música',
        theme_color: '#284C71',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,ttf,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.+\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'himnos-data',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],
})
