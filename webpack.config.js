var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './client/src/app.jsx',
	output: {
		path: path.resolve(__dirname, 'client/dist/js'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				query: { presets: ['es2015', 'react'] },
				loader: 'babel-loader',
				include: __dirname + '/client'
			},
			{
				test: /\.css/,
				loader: ExtractTextPlugin.extract("css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]")
				// loaders: ['style-loader', 'css-loader'],
				// include: __dirname + '/src'
			},
			{
				test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader'			
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
};