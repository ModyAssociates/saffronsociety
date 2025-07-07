import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888/.netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Redirect Emotion's CJS call to an ESM module on esm.sh:
      '@emotion/is-prop-valid': 'https://esm.sh/is-prop-valid',
      // And still handle cookie → cookie-es
      cookie: 'cookie-es',
    },
  },
  optimizeDeps: {
    include: ['https://esm.sh/is-prop-valid'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /@emotion\/is-prop-valid/],
    },
  },
})
