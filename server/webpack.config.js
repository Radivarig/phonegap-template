'use strict'

const path = require('path')
const fs = require('fs')

let nodeModules = {}
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod)

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  devtool: "source-map",
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel', 'eslint'], exclude: /node_modules/ }
    ]
  },
    eslint: {
    fix: true
  },
  externals: nodeModules
}
