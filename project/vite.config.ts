import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // swap out cookie → cookie-es so react-router’s parse import works
      cookie: 'cookie-es',
    },
  },

  // ← Add this block to force-include Emotion’s CJS helper
  optimizeDeps: {
    include: ['@emotion/is-prop-valid'],
  },

  server: {
    // if you proxy your Netlify functions, you can enable this:
    // proxy: {
    //   '/.netlify/functions': {
    //     target: 'http://localhost:8888',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/.netlify\/functions/, '/.netlify/functions'),
    //   },
    // },
  },
});
