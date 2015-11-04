var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/index',
        vendor: ['react', 'react/addons', 'superagent']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[hash].bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
        }]
    }
};
