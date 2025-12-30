import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative base path for maximum compatibility (Vercel & GitHub Pages)
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['crate.svg'],
      scope: './',
      manifest: {
        name: 'My Household Inventory',
        short_name: 'Inventory',
        description: 'Premium Household Inventory Management',
        theme_color: '#ffffff',
        start_url: './',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'crate.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'crate.svg', // Fallback for 192 (some browsers might prefer png, but svg is widely supported now)
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'crate.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
