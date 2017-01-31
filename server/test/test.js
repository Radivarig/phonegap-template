process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const app = require('../src/app.js')
var knex = require('../db/knex.js')

describe('beforeEach afterEach', () => {

  beforeEach((done) =>
    knex.migrate.rollback()
    .then(() =>
      knex.migrate.latest()
      .then(() =>
        knex.seed.run()
        .then(done)
      )
    )
  )

  afterEach((done) =>
    knex.migrate.rollback()
    .then(done)
  )
})

describe('test example', () => {
  it('POST /ajax_post should return string_field', (done) => {
    chai.request(app.listen())
    .post('/ajax_post')
    .send({method: 'get_data'})
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.be.json
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
