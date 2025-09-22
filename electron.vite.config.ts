import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig(({ mode }) => ({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'packages/__electron/src/main/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'packages/__electron/src/preload/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve(__dirname, 'packages/__electron/src/renderer/'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'packages/__electron/src/renderer/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'packages/__electron/src/renderer/src'),
      },
    },
    plugins: [react()],

    // NOTE: UIライブラリ内部におけるNODE_ENVでの挙動制御をViteのビルドモードに同調させる
    // @see https://github.com/adobe/react-spectrum/discussions/8189#discussioncomment-13059244
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode === 'production' ? 'production' : 'development'),
      },
    },
  },
}));
