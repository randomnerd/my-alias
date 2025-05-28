import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25MB
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    },
  })],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks: (id) => {
          // Core React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Routing
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          
          // State management
          if (id.includes('mobx')) {
            return 'mobx';
          }
          
          // Mantine core components
          if (id.includes('@mantine/core')) {
            return 'mantine-core';
          }
          
          // Mantine hooks
          if (id.includes('@mantine/hooks')) {
            return 'mantine-hooks';
          }
          
          // Icons
          if (id.includes('@tabler/icons-react')) {
            return 'icons';
          }
          
          // Internationalization
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
          
          // Large vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit since we're optimizing chunking
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['fsevents'],
    include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
  },
})
