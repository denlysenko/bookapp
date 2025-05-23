import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['**/webpack.config.js'],
  },
  {
    files: ['**/*.ts'],
    rules: {},
  },
];
