var path = require('path')
var utils = require('./utils')
var merge = require('webpack-merge')
var projectRoot = path.resolve(__dirname, '../')
// const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

var entris = require('./entris')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var baseWebpackConfig = {
  entry: {
    //user: './asset/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].[hash].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : (process.env.NODE_ENV === 'development' ? config.dev.assetsPublicPath : config.test.assetsPublicPath)
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('asset'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: {
        //   loaders: {
        //     scss: 'vue-style-loader!css-loader!sass-loader!less-loader', // <style lang="scss">
        //   }
        // },
        // exclude: /node_modules/
        options: vueLoaderConfig
      },
      {
        test: /vue-scroller.src.*?js$/,
        loader: 'babel'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '..', 'asset')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg|woff)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /muse-ui.src.*?js$/,
        loader: 'babel-loader'
      },
      { test: /iview.src.*?js$/, loader: 'babel-loader' },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}

baseWebpackConfig.entry = Object.assign(baseWebpackConfig.entry, entris)
module.exports = baseWebpackConfig

// module.exports = merge(webpackConfig, {
//   plugins: [
//     // { name: 'vux-ui' },
//     { name: 'progress-bar' }
//   ]
// })
