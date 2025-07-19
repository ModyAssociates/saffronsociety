import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Redirect Emotion's CJS call to an ESM module on esm.sh:
      '@emotion/is-prop-valid': 'https://esm.sh/is-prop-valid',
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
