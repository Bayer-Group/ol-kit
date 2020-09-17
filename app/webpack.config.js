const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const babelConfig = require('../babel.config.js')

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
      // these ensure we don't have duplicate versions on the same page
      '@bayer/ol-kit': path.resolve(__dirname, '../', 'src'),
      // 'react-dom': path.resolve(__dirname, '../', 'node_modules/@hot-loader/react-dom')
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
      }
    ]
  },

  plugins: [
    // Injects path.appSrc into public/index.html
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'index.html'),
      favicon: path.resolve(__dirname, 'favicon.ico')
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
  },
  node: { fs: 'empty' }
}
