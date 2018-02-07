var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var entris = require('./entris')

var env = config.build.env

env.NODE_ENV_TYPE = process.env.NODE_ENV_TYPE

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  devtool: false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('js/[id].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[chunkhash].css')
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // new HtmlWebpackPlugin({
    //   filename: process.env.NODE_ENV === 'testing'
    //     ? 'index.html'
    //     : config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    // new OptimizeCSSPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

Object.keys(entris).forEach(function(entry) {
  var template = 'index.html'

  if (process.env.NODE_ENV_TYPE === '"browser"') {
    template = 'index_browser.html'
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    chunks: [ 'manifest', 'vendor', entry ],
    filename: 'public/' + entry + '.html',
    template: template,
    inject: true,
    minify: {
      // removeComments: true,
      // collapseWhitespace: true,
      // removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency'
  }))
})

module.exports = webpackConfig
