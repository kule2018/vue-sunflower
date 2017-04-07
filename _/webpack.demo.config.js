var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../examples/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".vue", ".json" ]
  },
  externals: {
    "vue": "Vue",
    "vue-router": "VueRouter",
    "../dist/sunflower": "Sunflower"
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
      new HtmlWebpackPlugin({
        title: "sunflower",
        filename: "sunflower.html",
        template: path.resolve(__dirname, "../index.html"),
        inject: true
      })
  ]
};