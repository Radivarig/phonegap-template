const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const compression = require('compression')

const {ajaxHandler} = require('./ajaxHandler.js')
const whitelist = require('./whitelist')

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', whitelist)
  res.header('Access-Control-Allow-Methods', 'POST')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.set('port', process.env.PORT || 7777) // eslint-disable-line no-undef
app.use(compression())
app.use(allowCrossDomain)
app.use(bodyParser.json())
app.enable('trust proxy')

app.post('/ajax_post', ajaxHandler.handlePostRequest)

module.exports = app
