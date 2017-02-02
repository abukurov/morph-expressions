/* eslint-env node */

const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';
const plugins = [];

if (production) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: require.resolve('./src/index.js'),

  output: {
    path: './dist',
    filename: `morph-expression${production ? '.min' : ''}.js`,
    library: 'Parser',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins
};