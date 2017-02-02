const app = require('./app.js')

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`) // eslint-disable-line
  console.log(`NODE_ENV=${process.env.NODE_ENV || ''}`) // eslint-disable-line
})
