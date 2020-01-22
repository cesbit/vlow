/* global require, __dirname, module, process */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 5,
                },
            }),
        ]
    }
};

module.exports = config;