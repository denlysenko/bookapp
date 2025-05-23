import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    ignores: ['**/vite.config.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
];
