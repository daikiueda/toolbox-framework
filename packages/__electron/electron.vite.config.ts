import { execSync } from 'child_process';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig } from 'electron-vite';
import macros from 'unplugin-parcel-macros';

// 開発時に.envを読み込む
config({ path: resolve(__dirname, '.env') });

// ビルド時にgitリビジョンハッシュを取得
const getGitRevision = (): string => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
};

// ビルド時に最初のgitコミットの年を取得
const getFirstGitCommitYear = (): string => {
  try {
    const commitDate = execSync('git log --reverse --format=%ci | head -1', {
      encoding: 'utf-8',
    }).trim();
    const year = commitDate.split('-')[0];
    return year;
  } catch {
    return new Date().getFullYear().toString();
  }
};

// ビルド時に最新gitコミットの年を取得
const getLatestGitCommitYear = (): string => {
  try {
    const commitDate = execSync('git log -1 --format=%ci', { encoding: 'utf-8' }).trim();
    const year = commitDate.split('-')[0];
    return year;
  } catch {
    return new Date().getFullYear().toString();
  }
};

export default defineConfig(({ mode }) => ({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
        },
      },
    },
    // ビルド時に環境変数とgitリビジョンを埋め込む
    define: {
      'import.meta.env.VITE_SALESFORCE_CLIENT_ID': JSON.stringify(
        process.env.VITE_SALESFORCE_CLIENT_ID || ''
      ),
      __GIT_REVISION__: JSON.stringify(getGitRevision()),
      __GIT_FIRST_COMMIT_YEAR__: JSON.stringify(getFirstGitCommitYear()),
      __GIT_LATEST_COMMIT_YEAR__: JSON.stringify(getLatestGitCommitYear()),
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
        },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer/'),
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
        },
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
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
      },
    },
    plugins: [macros.vite(), react()],

    // NOTE: UIライブラリ内部におけるNODE_ENVでの挙動制御をViteのビルドモードに同調させる
    // @see https://github.com/adobe/react-spectrum/discussions/8189#discussioncomment-13059244
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode === 'production' ? 'production' : 'development'),
      },
    },
  },
}));
