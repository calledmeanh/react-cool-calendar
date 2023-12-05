const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, exclude: /node_modules/, include: path.join(__dirname, 'src'), use: ['babel-loader'] },
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
    ],
  },
  // allow to import component from different files
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'dist', 'index.html'),
    }),
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
