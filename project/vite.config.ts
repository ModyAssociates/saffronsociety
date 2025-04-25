import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // whenever code does "import { parse } from 'cookie'",
      // use the ESM-ready cookie-es package instead
      cookie: 'cookie-es',
    },
  },
  server: {
    // (your existing proxy, if you have one)
    // proxy: { '/.netlify/functions': { /* ... */ } }
  },
  build: {
    // no special build tweaks needed here
  },
});
