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

  module: {
    rules: [
      // Critial to run lint prior to compilation
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      },
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
    }),

    // Do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    hot: true,
    port: 3000,
    clientLogLevel: 'none',
    publicPath: path.resolve('/map'),
    contentBase: path.resolve(__dirname, '../', 'build'),
    before: (app, server) => {
      // fake an HTML response so we don't have 404 warnings in the console
      app.get('/profile/search/*', (req, res) => {
        return res.send('<html>Hello world</html>')
      })
      // attach Phoenix service bindings (so the navbar & other stuff works)
      app.use('/map/phoenix/service-bindings', require('@monsantoit/phoenix-service-bindings-middleware')())
    }
  }
}
