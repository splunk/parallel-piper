var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');

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
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?optional=runtime,jsxPragma=vdom"},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
            {test: /\.(woff|eot|ttf|png|svg)$/, loader: "file-loader"}
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
        }),
        new DefinePlugin({
            SPLUNK_HOST: JSON.stringify(process.env.PP_SPLUNK_HOST || 'localhost'),
            SPLUNK_PORT: JSON.stringify(parseInt(process.env.PP_SPLUNK_PORT || 8088, 10)),
            SPLUNK_SSL: JSON.stringify(process.env.PP_SPLUNK_SSL == 'true' || false),
            SPLUNK_TOKEN: JSON.stringify(process.env.PP_SPLUNK_TOKEN || fail('Environment variable PP_SPLUNK_TOKEN is required.'))
        })
    ]
};
