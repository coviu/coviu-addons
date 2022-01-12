const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = {
  entry: {
    plugin: './index.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        /* Only run Babel on our local JS, not our dependencies */
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin({NODE_ENV: 'development'})],
  devtool: 'hidden-source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    port: 9100,
    host: 'localhost',
    hot: false,
    static: './dist',
    watchFiles: ['./index.js', './lib/**/*'],
    allowedHosts: ['dev.localhost'],
  },
  watchOptions: {
    aggregateTimeout: 100,
    poll: true,
  },
};
