import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { VitePWA } from 'vite-plugin-pwa';

// Note: PWA plugin is temporarily disabled due to compatibility issue with glob@11
// The workbox-build dependency has a globbing error with the newer glob package
// To re-enable PWA features, uncomment the import and plugin configuration below
// Once vite-plugin-pwa updates to be compatible with glob@11, this can be restored

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(), 
    // PWA plugin disabled to eliminate globbing warnings
    // Uncomment when vite-plugin-pwa is compatible with glob@11
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     skipWaiting: true,
    //     clientsClaim: true,
    //     navigateFallback: null,
    //   },
    // })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks: {
          // Group React and ALL React-dependent libraries together
          'react-ui': [
            'react', 
            'react-dom', 
            'react-router-dom', 
            '@mantine/core', 
            '@mantine/hooks',
            'react-i18next'  // This depends on React hooks
          ],
          
          // State management
          'mobx': ['mobx', 'mobx-react-lite'],
          
          // Icons
          'icons': ['@tabler/icons-react'],
          
          // Core internationalization (no React dependencies)
          'i18n': ['i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    // Increase chunk size warning limit since we're optimizing chunking
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['fsevents'],
    include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks', 'react-router-dom'],
  },
})
