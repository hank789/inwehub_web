
var path = require('path')
var webpack = require('webpack')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const HOST = process.env.HOST || '127.0.0.1'
const PORT = (process.env.PORT && Number(process.env.PORT)) || 8076
const CopyWebpackPlugin = require('copy-webpack-plugin')
const os = require('os')
const HappyPack = require('happypack')
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

module.exports = {
  entry: {
    index: [
      './asset/modules/index'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '..', 'asset')
    }
  },
  cache: true,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'happypack/loader?id=js',
            css: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  minimize: false,
                  sourceMap: false
                }
              }
            ],
            less: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  minimize: false,
                  sourceMap: false
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          cacheBusting: true,
          cssSourceMap: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /vue-scroller.src.*?js$/,
        loader: 'babel'
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=js',
        include: [path.join(__dirname, '..', 'asset')],
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg|woff)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: new RegExp('\\.css$'),
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: false
            }
          }
        ]
      },
      {
        test: new RegExp('\\.less$'),
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happThreadPool,
      debug: true
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        API_ROOT: '"https://api.ywhub.com/"',
        H5_ROOT: '"https://web.ywhub.com"',
        READHUB_URL: '"https://read.ywhub.com"',
        GA_CODE: '"UA-97476315-3"',
        ECHO_SERVER_ADDRESS: '"https://read.ywhub.com"',
        DEEP_LINK_KEY: '"A0kU"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${HOST}:${PORT}`]
      }
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'index'],
      filename: 'index.html',
      template: 'index_dev.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static_dev'),
        to: 'static_dev',
        ignore: ['.*']
      }
    ])
  ],
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: '/index.html'
        }
      ]
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST,
    port: PORT,
    open: false,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    proxy: {},
    quiet: true,
    watchOptions: {
      poll: false
    }
  }
}
