// project/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    react(),
    // this will turn commonjs modules into proper ESM
    commonjs({
      include: [/node_modules/],
    }),
  ],
  optimizeDeps: {
    // ensure Emotion (and any CJS dep) is pre-bubbled
    include: ['@emotion/is-prop-valid', '@emotion/react', '@emotion/styled'],
  },
  server: {
    // your existing dev-server proxy config, if any
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
