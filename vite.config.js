import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: {
    watch: {
      // Ignore editor/agent temp swap files (e.g. .App.jsx.1234.uuid.tmpdir/)
      // so the Windows chokidar watcher doesn't crash with EBUSY.
      ignored: ['**/.*.tmpdir/**', '**/.*.tmp'],
    },
  },
});
