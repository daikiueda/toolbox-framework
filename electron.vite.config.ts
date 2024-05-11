import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/src/main/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/src/preload/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve(__dirname, 'electron/src/renderer/'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/src/renderer/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'electron/src/renderer/src'),
      },
    },
    plugins: [react()],
  },
});
