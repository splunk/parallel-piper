var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

function fail(msg) {
    throw new Error(msg);
}

module.exports = {
    entry: 'app.js',
    resolve: {
        root: path.join(__dirname, 'lib'),
    },
    output: {
        publicPath: '',
        path: path.join(__dirname, 'dist'),
        filename: 'piper.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?optional=runtime,jsxPragma=vdom" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
            { test: /\.(woff|eot|ttf|png|svg)$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new ExtractTextPlugin("piper.css"),
        new HtmlWebpackPlugin({
            title: 'Parallel Piper',
            template: 'index.html',
            inject: 'body',
            minify: {},
            hash: true
        })
    ]
};
