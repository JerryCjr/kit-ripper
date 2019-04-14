var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function __path_src() {
  return path.resolve(__dirname, '../src');
}

function __path_test() {
  return path.resolve(__dirname, '../test/unit');
}

function __module_include() {
  return [__path_src(), __path_test()];
}

function __module_css_include() {
  var arr = __module_include();
  return arr;
}

function __cssLoaders() {
  if (process.env.NODE_ENV === 'production') {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: process.env.NODE_ENV === 'production' ? false : true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: process.env.NODE_ENV === 'production' ? false : true
          }
        }
      ]
    });
  }
  else {
    return [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'postcss-loader'
      }
    ];
  }
}

function __urlLoaders() {
  if (process.env.NODE_ENV === 'production') {
    return [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[ext]'
        }
      }
    ];
  }
  else {
    return [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'static/img/[name].[ext]'
        }
      }
    ];
  }
}

function __vuecssLoaders(loaderName) {
  var loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: process.env.NODE_ENV === 'production' ? false : true
      }
    }
  ];
  if (loaderName) {
    loaders.push({
      loader: loaderName + '-loader',
      options: {
        sourceMap: process.env.NODE_ENV === 'production' ? false : true
      }
    });
  }

  if (process.env.NODE_ENV === 'production') {
    return ExtractTextPlugin.extract({
      fallback: 'vue-style-loader',
      use: loaders
    });
  }
  else {
    return [
      {
        loader: 'vue-style-loader'
      }
    ].concat(loaders);
  }
}

module.exports = {
  entry: {
    index: __path_src()
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|html|vue)$/,
        include: __module_include(),
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        include: __module_include(),
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: __vuecssLoaders(),
                sass: __vuecssLoaders('sass'),
                scss: __vuecssLoaders('sass'),
                less: __vuecssLoaders('less')
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: __module_include(),
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        include: __module_include(),
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        resource: {
          test: /\.css$/,
          include: __module_css_include()
        },
        use: __cssLoaders()
      },
      {
        resource: {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          include: __module_include()
        },
        use: __urlLoaders()
      }
    ]
  }
};
