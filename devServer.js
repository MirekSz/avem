var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var app = express();
var compiler = webpack(config);

function apiProxy(host, port) {

    return function (req, res, next) {
        if (req.url.match(new RegExp('^\/containers\/')) || req.url.match(new RegExp('^\/images\/')) || req.url.match(new RegExp('^\/commit'))) {
            proxy.web(req, res, {target: 'http://strumyk-next-build:2375/'});
        } else {
            next();
        }
    }
}
app.use(apiProxy('localhost', 3000));
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/assets/:name', function (req, res) {
    res.sendFile(path.join(__dirname, req.originalUrl));
});
app.get('/assets/*/:name', function (req, res) {
    res.sendFile(path.join(__dirname, req.originalUrl));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});
