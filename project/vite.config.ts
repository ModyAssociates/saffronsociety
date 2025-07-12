import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
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
