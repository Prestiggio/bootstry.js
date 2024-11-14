const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./cenv');

module.exports = {
    entry: {
        bootstry: path.join(__dirname, '../index.js')
    },
    output: {
        filename: 'medias/js/[name].js',
        chunkFilename: 'medias/js/[name].js',
        path: `/build/themes/${config.theme.path}`,
        library: '$Ry'
    },
    resolve: {
        alias: {
            ryvendor: path.resolve(__dirname, '../../../vendor'),
            medias: path.resolve(__dirname, '../medias')
        },
        modules: ['themes/tailwindcss', 'themes', 'vendor', 'node_modules']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Bootstry',
            template: 'index.html',
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react']
                    }
                }
            }
        ],
    }
}