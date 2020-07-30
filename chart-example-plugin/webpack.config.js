const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		plugin: './index.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js'
	},
	module: {
		loaders: [{
			/* Only run Babel on our local JS, not our dependencies */
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		},
		{ test: /\.json$/, loader: 'json' },
		{
			test: /\.module.scss$/,
			loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!sass'
		},
		{
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.DedupePlugin()
	],
	devtool: 'hidden-source-map',
	node: {
		console: true,
		net: 'empty',
		tls: 'empty'
	}
};
