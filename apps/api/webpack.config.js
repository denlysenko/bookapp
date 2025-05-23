const { composePlugins, withNx } = require('@nx/webpack');
const path = require('node:path');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    return config;
  }
);
