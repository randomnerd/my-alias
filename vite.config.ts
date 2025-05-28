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
