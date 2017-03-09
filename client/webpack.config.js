module.exports = {
  entry: "./src/entry.jsx",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel', 'eslint'], exclude: /node_modules/ }
    ]
  },
  eslint: {
    fix: true
  },
  resolve: {
    modulesDirectories: ['src/'],
    fallback: __dirname +"/node_modules",
    extensions: ['', '.js', '.jsx'],
  }
}
