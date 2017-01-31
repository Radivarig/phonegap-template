// eslint-disable-next-line no-undef
const environment = process.env.NODE_ENV || 'development'
const config = require('../knexfile.js')[environment]

module.exports = require('knex')(config)
