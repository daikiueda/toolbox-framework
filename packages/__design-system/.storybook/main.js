import { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../README.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  viteFinal: async (config) => {
    // React Spectrumコンポーネント（特に@react-spectrum/picker）の内部で
    // Node.js固有のprocess.envを参照しているため、ブラウザ環境で
    // "process is not defined" エラーが発生する。
    // Viteのdefine設定でコンパイル時にprocess.envを安全な値に置換することで
    // この問題を解決している。
    config.define = {
      ...config.define,
      global: 'globalThis', // Node.jsのglobalオブジェクトをブラウザ対応
      'process.env': 'globalThis.process?.env || {}', // process.envを安全にpolyfill
    };
    return config;
  },
};
export default config;
