import electronPrettier from '@electron-toolkit/eslint-config-prettier';
import electronTs from '@electron-toolkit/eslint-config-ts';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
    ignores: ['node_modules/**', 'dist/**', 'out/**', '.gitignore', 'packages/__template/bin/**'],
  },
];
