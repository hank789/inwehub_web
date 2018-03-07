var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var entris = require('./entris')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

config.dev.env.NODE_ENV_TYPE = process.env.NODE_ENV_TYPE

var config = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    // new ExtractTextPlugin({
    //   filename: utils.assetsPath('css/[name].[chunkhash].css')
    // }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./manifest.json")
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    new FriendlyErrorsPlugin()
  ]
})


Object.keys(entris).forEach(function(entry) {
  config.plugins.push(
    new HtmlWebpackPlugin({
      chunks: ['vendor', entry],
      filename: entry + '.html',
      template: 'index_dev.html',
      inject: true
    })
  )
})

module.exports = config
