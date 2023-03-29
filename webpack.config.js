const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config();

const environmentOptions = () => {
  if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
    return {
      mode: 'production',
      optimization: {
        minimize: true,
        minimizer: [
          new TerserWebpackPlugin({
            parallel: true,
          }),
        ],
      },
    };
  }

  return {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      open: true,
      port: 4000,
      disableHostCheck: true,
    },
  };
};

module.exports = () => ({
  ...environmentOptions(),
  target: ['web', 'es5'],
  entry: {
    index: './src/index.js',
    connector: './src/connector.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[fullhash].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.AMPLITUDE_KEY': JSON.stringify(process.env.AMPLITUDE_KEY),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'connector.html',
      template: './src/connector.html',
      chunks: ['connector'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
});
