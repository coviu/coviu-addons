const webpack = require('webpack');

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
      },
      {
        test: /\.module\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          { loader: 'style-loader' },
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]___[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          // Compiles Sass to CSS
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  devtool: 'hidden-source-map',
  node: {
    console: true,
    net: 'empty',
    tls: 'empty',
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    disableHostCheck: true,
  },
};
