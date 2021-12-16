const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const babelConfig = require('../babel.config.js')

// during development be sure to pass this env variable so that we get the alias to src gets created
const alias = process.env.OL_KIT_DEVELOPMENT ? { '@bayer/ol-kit': path.resolve(__dirname, '../', 'src') } : {}

module.exports = {
  mode: 'development',
  target: 'web',

  entry: [path.resolve(__dirname, 'index.js')],
  output: {
    path: path.resolve(__dirname, '../', 'build'),
    filename: 'bundle.js',
    // Include comments in bundles with information about the contained modules.
    // DO NOT USE in production!!
    pathinfo: true
  },

  // A SourceMap without column-mappings that simplifies loaded Source Maps to a
  // single mapping per line. Original source (lines only)
  devtool: 'cheap-module-source-map',

  resolve: {
    // Create aliases to import or require certain modules more easily
    alias: {
      ...alias,
      'react-dom': '@hot-loader/react-dom'
    },
    fallback: {
      fs: false,
      stream: false
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new WebpackBar({ name: 'ol-kit' }),

    // Injects path.appSrc into public/index.html
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'index.html'),
      favicon: path.resolve(__dirname, 'favicon.ico')
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),

    // Do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    port: 2020,
    clientLogLevel: 'none',
    publicPath: path.resolve('/'),
    contentBase: path.resolve(__dirname, '../', 'build'),
    historyApiFallback: true
  }
}
