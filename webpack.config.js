const path = require('path');

const fileName = 'compile';

module.exports = {
	mode: 'production',
	target: 'web',
	entry: './lib/index.ts',
	output: {
		path: path.resolve(__dirname, '.', 'dist/lib/'),
		filename: `${fileName}.umd.js`,
	},
	module: {
		rules: [
			{
				test: /\.(ts)$/,
				include: [
					path.join(__dirname, 'node_modules', '@vue/compiler-core'),
					path.join(__dirname, 'lib'),
				],
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				],
				exclude: /node_modules/,
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', 'json'],
	},
};
