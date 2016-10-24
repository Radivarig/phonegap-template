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
    modulesDirectories: ['src/module_components', 'src/redux'],
    fallback: __dirname +"/node_modules",
    extensions: ['', '.js', '.jsx'],
  }
}
