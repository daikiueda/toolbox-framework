import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: resolve(__dirname, 'gui'),
  plugins: [macros.vite(), react()],
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Bundle all S2 and style-macro generated CSS into a single bundle instead of code splitting.
        // Because atomic CSS has so much overlap between components, loading all CSS up front results in
        // smaller bundles instead of producing duplication between pages.
        manualChunks(id) {
          if (/macro-(.*)\.css$/.test(id) || /@react-spectrum\/s2\/.*\.css$/.test(id)) {
            return 's2-styles';
          }
          return null;
        },
      },
    },
  },

  // NOTE: UIライブラリ内部におけるNODE_ENVでの挙動制御をViteのビルドモードに同調させる
  // @see https://github.com/adobe/react-spectrum/discussions/8189#discussioncomment-13059244
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
  },
}));
