import { EnvironmentPlugin } from 'webpack';

export const entry = {
  plugin: './index.js',
};
export const output = {
  path: __dirname + '/dist',
  filename: '[name].js',
};
export const module = {
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
        'style-loader', 'css-loader'
      ],
    },
  ],
};
export const plugins = [new EnvironmentPlugin({ NODE_ENV: 'development' })];
export const devtool = 'hidden-source-map';
export const devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
  port: 9100,
  host: 'localhost',
  hot: false,
  static: './dist',
  watchFiles: ['./index.js', './lib/**/*'],
  allowedHosts: ['.dev.localhost', '.localhost'],
};
export const watchOptions = {
  aggregateTimeout: 100,
  poll: true,
};
