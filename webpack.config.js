const path = require("path")

module.exports = {
  devtool: "eval-source-map",
  entry: [
    "babel-polyfill",
    path.resolve("src", "index.js"),
  ],
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
    ]
  }
}
