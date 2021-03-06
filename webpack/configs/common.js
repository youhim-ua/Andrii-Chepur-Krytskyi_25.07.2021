const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = env => ({
  mode: env.mode,
  context: path.resolve(__dirname, '../../src'),
  entry: {
    main: './index.js',
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // images
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        use: [
          {
            loader: 'img-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },           
          }
        ],
      },
      // fonts & SVG
      {
        test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      // Handlebars
      {
        test: /\.hbs$/,
        use: {
          loader: 'handlebars-loader',
          options: {
            precompileOptions: {
              knownHelpersOnly: false,
            },
            helperDirs: path.resolve(__dirname, '../../src/js/services/helper'),
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackBar()
  ],
});
