var path = require("path");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/index.js")
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
  }
};