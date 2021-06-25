const path = require('path');
const cpus = require('os').cpus();
// const webpackBar = require('webpackbar');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const fileName = 'compile';

const smp = new SpeedMeasurePlugin();
const smpWrapperConfig = smp.wrap({
  mode: 'production',
  target: 'web',
  entry: './lib/index.ts',
  output: {
    path: path.resolve(__dirname, '.', 'dist/lib/'),
    filename: `${fileName}.umd.js`,
  },
  // new webpackBar({})
  optimization: {
    minimize: false,
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: false,
    //     exclude: /node_modules/,
    //     terserOptions: {
    //       sourceMap: false,
    //     },
    //   })
    // ]
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(ts|js)/,
        exclude: /(node_modules|bower_components)/,
        use: [
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
});

module.exports = smpWrapperConfig;
