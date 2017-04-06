var path = require("path");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    sunflower: path.resolve(__dirname, "../src/index.js")
  },
  externals: {
    vue: "Vue"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "Sunflower"
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
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};