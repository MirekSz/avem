var path = require('path');
var webpack = require('webpack');

module.exports = {
    debug: true,
    devtool: 'cheap-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            PROD: false,
            DOCKER_API: JSON.stringify('strumyk-next-client-db')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader'
            },
            {test: /\.hbs/, loader: "handlebars-loader"}]
    },
    node: {
        fs: "empty" // avoids error messages
    }
};
