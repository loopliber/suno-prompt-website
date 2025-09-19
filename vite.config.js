import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
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
    // TEMP: Disable custom manual chunk splitting while debugging useLayoutEffect error.
    // If a root-cause is unrelated to chunking we can restore a leaner version later.
    // (Leaving rollupOptions empty lets Vite decide optimal splits.)
    rollupOptions: {},

    // Target modern browsers for better optimization
    target: 'es2020',

    // Enable source maps in production to map the failing stack frame.
    sourcemap: true,

    // Minimize CSS
    cssMinify: true,

    // Compress output
    minify: 'esbuild',

    // Keep console & debugger statements for now so diagnostics appear in prod.
    esbuild: {
      drop: []
    }
  },
  
  // CSS optimization
  css: {
    devSourcemap: true
  }
}) 