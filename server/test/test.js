const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const app = require('../src/app.js')

describe('test example', () => {
  it('POST /ajax_post should return 200', (done) => {
    chai.request(app.listen())
    .post('/ajax_post')
    .end((err, res) => {
      res.statusCode.should.equal(200)
      done()
    })
  })
})
