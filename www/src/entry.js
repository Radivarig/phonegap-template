require('babel-polyfill')

var React = require('react')
var ReactDOM = require('react-dom')

var routes = require('./routes.jsx')

ReactDOM.render(routes, document.getElementById('app'))
