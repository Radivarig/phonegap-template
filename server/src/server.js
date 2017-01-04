require('babel-polyfill')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const compression = require('compression')

const server_api = require('./server_api')
const whitelist = require('./whitelist')

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', whitelist)
  res.header('Access-Control-Allow-Methods', 'POST')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.set('port', 7777) // process.env.PORT ||
app.use(compression())
app.use(allowCrossDomain)
app.use(bodyParser.json())
app.enable('trust proxy')

app.post('/ajax_post', server_api.ajax_post)

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${app.get('port')}`)
})
