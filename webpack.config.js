const path = require('path');
const HTMLWebackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
    analytics: './src/analytics.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HTMLWebackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
  ],
};
