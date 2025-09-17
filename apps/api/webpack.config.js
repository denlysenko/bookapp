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
    // debugging fix https://github.com/nrwl/nx/issues/14708#issuecomment-1457996600
    config.output.devtoolModuleFilenameTemplate = function (info) {
      return `webpack:///./${path.relative(process.cwd(), info.absoluteResourcePath)}`;
    };

    return config;
  }
);
