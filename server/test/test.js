const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const app = require('../src/app.js')
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${app.get('port')}`)
})


describe('test example', () => {
  it('POST /ajax_post should return 200', (done) => {
    chai.request(server)
    .post('/ajax_post')
    .end((err, res) => {
      res.statusCode.should.equal(200)
      done()
    })
  })
})
