const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        port: 3000
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js' // makes dragonbones work
        }),
        new CopyWebpackPlugin([{
            from: 'build/assets',
            to: 'assets'
        }]),

        new HTMLWebpackPlugin({
            template: 'build/index.html',
            filename: 'index.html'
        })
    ]
}