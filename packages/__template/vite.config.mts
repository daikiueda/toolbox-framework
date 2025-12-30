import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: resolve(__dirname, 'gui'),
  plugins: [macros.vite(), react()],

  // NOTE: UIライブラリ内部におけるNODE_ENVでの挙動制御をViteのビルドモードに同調させる
  // @see https://github.com/adobe/react-spectrum/discussions/8189#discussioncomment-13059244
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
  },
}));
