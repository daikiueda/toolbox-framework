// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import electronPrettier from '@electron-toolkit/eslint-config-prettier';
import electronTs from '@electron-toolkit/eslint-config-ts';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import storybook from 'eslint-plugin-storybook';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const prettierCompatConfig = { ...electronPrettier };
delete prettierCompatConfig.name;
if (prettierCompatConfig.plugins && !Array.isArray(prettierCompatConfig.plugins)) {
  prettierCompatConfig.plugins = Object.keys(prettierCompatConfig.plugins);
}

export default [
  js.configs.recommended,
  ...compat.config({
    extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime'],
    settings: { react: { version: 'detect' } },
  }),
  ...electronTs.configs.recommended,
  ...compat.config(prettierCompatConfig),
  {
    rules: {
      semi: 0,
      '@typescript-eslint/explicit-function-return-type': 0,
    },
  },
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', 'dist/**', 'out/**', 'packages/*/bin/**', '.gitignore'],
  },
  ...storybook.configs['flat/recommended'],
];
