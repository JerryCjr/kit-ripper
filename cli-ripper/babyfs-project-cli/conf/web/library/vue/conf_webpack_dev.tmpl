var baseConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var devConfig = merge(baseConfig, {
  entry: {
    index: path.resolve(__dirname, '../src/demo/index.js')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  output: {
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[id].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

Object.keys(devConfig.entry).forEach(function (name) {
  devConfig.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(devConfig.entry[name])
})

module.exports = devConfig;
