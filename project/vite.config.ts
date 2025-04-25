import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    react(),
    // transform CJS modules (like cookie) to ESM
    commonjs({
      include: ['node_modules/**']
    })
  ],
  resolve: {
    // ensure Rollup sees the cookie entry-point
    extensions: ['.js', '.mjs', '.ts', '.json']
  },
  build: {
    /* your existing production build settings */
  }
})
