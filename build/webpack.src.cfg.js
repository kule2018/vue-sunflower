const path = require("path");

module.exports = {
  entry: {
    sunflower: path.resolve(__dirname, "../src/index.js")
  },
  output: {
    path: path.resolve(__dirname, "../dist/sunflower"),
    filename: "[name].js",
    library: "Sunflower",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".vue"]
  }
};