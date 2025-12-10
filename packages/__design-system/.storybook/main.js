// This file has been automatically migrated to valid ESM format by Storybook.
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value) => {
  return dirname(fileURLToPath(import.meta.resolve(value)));
};

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
    // NOTE: UIライブラリ内部におけるNODE_ENVでの挙動制御用の依存情報
    config.define = {
      ...config.define,
      'process.env.NODE_ENV': JSON.stringify('development'),
    };
    return config;
  },
};
export default config;
