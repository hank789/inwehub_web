const webpack = require('webpack');
var path = require('path')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')
var config = require('../config')
var merge = require('webpack-merge')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const vendors = [
  'quill',
  'laravel-echo',
  'quilljs-renderer',
  'axios',
  'dom-to-image',
  'raven-js',
  'sortablejs',
  'v-tooltip',
  'vue',
  'vue-ga',
  'vue-infinite-scroll',
  'vue-qrcode-component',
  'vue-router',
  'swiper',
  'vue-awesome-swiper',
  'vue-timeago',
  'vue-wechat-title',
  'vue2-countdown',
  'vuex'
];

var webpackConfig = {
  output: {
    path: path.join(__dirname, "../static"),
    filename: `[name].[hash].js`,
    library: '[name]_[hash]',
  },
  entry: {
    vendor: vendors,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('asset'),
    }
  },
  performance: {
    hints: false
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
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: "[name]_[hash]",
      path: path.join(__dirname, "manifest.json"),
    }),
  ],
};

var config = merge(webpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
  }
})

module.exports = config;
