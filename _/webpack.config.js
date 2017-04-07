var path = require("path");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/index.js"),
    vendor: "vue"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "vue-sunflower"
  },
  resolve: {
    extensions: [".js", ".vue", ".json" ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
      new UglifyJSPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor"
      })
  ]
};