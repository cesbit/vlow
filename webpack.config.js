/* global require, __dirname, module */
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: 'production',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vlow.js',
        library: 'vlow',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: true
                    }
                }
            })
        ]
    }
};

module.exports = config;