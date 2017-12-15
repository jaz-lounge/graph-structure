var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './dist/index.js',
    library: 'Graph',
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
