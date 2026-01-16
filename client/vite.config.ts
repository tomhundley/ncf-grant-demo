/**
 * =============================================================================
 * Vite Configuration
 * =============================================================================
 *
 * Configuration for the Vite build tool. Includes:
 *   - React plugin for JSX transformation
 *   - Development server proxy for GraphQL API
 *   - Build optimizations for production
 *
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    port: 3000,
    // Proxy GraphQL requests to the Apollo Server
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    },
  },

  // Build configuration
  build: {
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-apollo': ['@apollo/client', 'graphql'],
        },
      },
    },
  },
});
