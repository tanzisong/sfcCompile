const path = require('path');
const cpus = require('os').cpus();
const webpackBar = require('webpackbar');
const smp = require('speed-measure-webpack-plugin');

const fileName = 'compile';

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './lib/index.ts',
  devtool: false,
  output: {
    path: path.resolve(__dirname, '.', 'dist/lib/'),
    filename: `${fileName}.umd.js`,
  },
  plugins: [new webpackBar({}), new smp()],
  module: {
    rules: [
      {
        test: /\.ts/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: cpus - 1,
            },
          },
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true },
          },
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     transpileOnly: true,
          //     happyPackMode: true,
          //   },
          // },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json'],
  },
};
