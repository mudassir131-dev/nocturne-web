import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { musicApiPlugin } from './server/apiPlugin.js';

// https://vite.dev/config/ - Multi-provider lyrics engine active
export default defineConfig({
  plugins: [
    react(),
    musicApiPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
