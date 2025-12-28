import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

// 開発時に.envを読み込む
config({ path: resolve(__dirname, '.env') });

export default defineConfig(({ mode }) => ({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'packages/__electron/src/main/index.ts'),
        },
        external: ['@salesforce/core'],
      },
    },
    plugins: [externalizeDepsPlugin()],
    // ビルド時に環境変数を埋め込む
    define: {
      'import.meta.env.VITE_SALESFORCE_CLIENT_ID': JSON.stringify(
        process.env.VITE_SALESFORCE_CLIENT_ID || ''
      ),
    },
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
