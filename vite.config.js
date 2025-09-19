import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      }
    }
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Router chunk
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // UI components chunk
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          
          // Animation chunk
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          
          // Icons chunk
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Utilities chunk
          if (id.includes('clsx') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Source maps for production debugging
    sourcemap: false,
    
    // Minimize CSS
    cssMinify: true,
    
    // Compress output
    minify: 'esbuild',
    
    // Remove console logs in production
    esbuild: {
      drop: ['console', 'debugger']
    }
  },
  
  // CSS optimization
  css: {
    devSourcemap: true
  }
}) 