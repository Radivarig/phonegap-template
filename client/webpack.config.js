const path = require ("path")

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'regenerator-runtime/runtime',
    path.resolve (__dirname, "src", "entry.jsx"),
  ],
  output: {
    path: path.resolve (__dirname, "build"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: ["babel-loader", "eslint-loader?fix=true"],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve (__dirname, "src"),
    ],
    extensions: [".js", ".jsx"],
  }
}
