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
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ }
    ]
  },
  externals: nodeModules
}
