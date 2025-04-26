import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // ensures react-router's `parse` comes from cookie-es
      cookie: 'cookie-es',
    },
  },

  // Dev-only pre-bundle
  optimizeDeps: {
    include: ['@emotion/is-prop-valid'],
  },

  // Build-time CommonJS handling
  build: {
    commonjsOptions: {
      include: [
        /node_modules/,                 // default
        /node_modules\/@emotion\/.*/,   // <-- add this
      ],
    },
  },

  server: {
    // your existing proxy can go here if you have one
    // proxy: { '/.netlify/functions': 'http://localhost:8888' }
  },
})
