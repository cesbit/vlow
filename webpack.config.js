/* global require, __dirname, module, process */
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: process.env.NODE_ENV === 'production' ? 'vlow.min.js' : 'vlow.js',
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