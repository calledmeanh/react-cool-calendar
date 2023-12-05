const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    // Open html file
    open: true,
    // Enable gzip compression for everything served
    compress: true,
    // When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses
    historyApiFallback: true,
    // Enable webpack's Hot Module Replacement feature
    hot: true,
  },
});
