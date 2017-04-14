const path = require("path");

module.exports = {
  entry: {
    demo: path.resolve(__dirname, "../example/main.js")
  },
  output: {
    path: path.resolve(__dirname, "../dist/demo"),
    filename: "[name].js",
    publicPath: "/a/b"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            "scss": "vue-style-loader!css-loader!sass-loader"
          }
        }
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
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    port: 9000
  }
};