process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const app = require('../src/app.js')

const knex = require('../db/knex.js')
const {ajaxHandler} = require ('../src/ajaxHandler.js')

describe('API ajaxHandler', () => {

  beforeEach(async () =>
    await knex.migrate.rollback()
    .then(() =>
      knex.migrate.latest()
      .then(() =>
        knex.seed.run()
      )
    )
  )

  afterEach(async () =>
    await knex.migrate.rollback()
  )

  it('`handleIfUnregisteredUser` should insert new user to table `unregistered`', async () => {
    const email = 'testuser@test.com'

    const id_from_users = await ajaxHandler.getColumn ('id', 'users', {email})
    expect (id_from_users).to.equal(undefined)

    const unregisteredUser: boolean = await ajaxHandler.handleIfUnregisteredUser(email)
    expect (unregisteredUser).to.equal(true)

    const id_from_unregistered = await ajaxHandler.getColumn ('id', 'unregistered', {email})
    expect (id_from_unregistered).to.not.equal(undefined)

  })

})

