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
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
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