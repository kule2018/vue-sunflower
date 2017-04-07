var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    sunflower: path.resolve(__dirname, "../src/index.js")
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "sunflower"
  },
  resolve: {
    extensions: [".js", ".vue", ".json"]
  },
  externals: {
    vue: "Vue"
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
  }
};