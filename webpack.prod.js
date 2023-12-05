const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // Useful for debugging as well as running benchmark tests
  devtool: 'source-map',
});
