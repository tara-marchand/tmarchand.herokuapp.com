var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var path = require('path');

module.exports = {
	// configuration
	entry: {
		vendor: ['jquery', 'underscore', 'firebase', 'backbone', 'backbonefire'],
		app: './public/scripts/contractors/contractors-app-src.js'
	},
	plugins: [
		new CommonsChunkPlugin({
		  name: 'vendor',
		  filename: 'contractors-lib.js',
		  minChunks: Infinity,
		}),
		new ProvidePlugin({
			'_': 'underscore',
			'$': 'jquery'
		}) 
	],
	output: {
		path: path.join(__dirname, 'public/scripts/contractors'),
		filename: 'contractors-app-dist.js'
	}
};