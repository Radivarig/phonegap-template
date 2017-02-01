process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const knex = require('../db/knex.js')
const {dbHandler} = require ('../src/dbHandler.js')
const {loginHandler} = require ('../src/loginHandler.js')

const app = require('../src/app.js')

// reset databases before and after each test
beforeEach(async () =>
  await knex.migrate.rollback()
  .then(() => knex.migrate.latest())
  .then(() => knex.seed.run())
)
afterEach(async () => await knex.migrate.rollback())

const email = 'testuser@test.com'

describe('API loginHandler.js', () => {

  it('`handleIfUnregisteredUser` should insert new user to table `unregistered`', async () => {
    const id_from_users = await dbHandler.getColumn ('id', 'users', {email})
    expect (id_from_users).to.equal(undefined)

    const unregisteredUser: boolean = await loginHandler.handleIfUnregisteredUser(email)
    expect (unregisteredUser).to.equal(true)

    const id_from_unregistered = await dbHandler.getColumn ('id', 'unregistered', {email})
    expect (id_from_unregistered).to.not.equal(undefined)
  })

})
