module.exports = {
  entry: "./src/entry.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ }
    ]
  },
  resolve: {
    fallback: __dirname +"/node_modules",
    root: __dirname +'/src/module_components',
    extensions: ['', '.js', '.jsx'],
  }
}
