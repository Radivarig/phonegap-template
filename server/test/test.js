process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const knex = require('../db/knex.js')
const {dbHandler} = require ('../src/dbHandler.js')
const {loginHandler, tables} = require ('../src/loginHandler.js')

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

  describe('insertOrUpdateTokenToUnconfirmed', () => {

    it('should insert/update user and token to table `unconfirmed`', async () => {
      const id_before = await dbHandler.getColumn ('id', tables.unconfirmed, {email})
      expect (id_before).to.equal(undefined)

      // inserting
      const token = 'token'
      const id_on_insert = await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
      expect (id_on_insert).to.not.equal(undefined)

      const token_after_insert = await dbHandler.getColumn ('token', tables.unconfirmed, {email})
      expect (token_after_insert).to.equal(token)

      const id_after_insert = await dbHandler.getColumn ('id', tables.unconfirmed, {email})
      expect (id_after_insert).to.equal(id_on_insert)

      // updating
      const token_update = 'token_update'
      const id_on_update = await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token_update)
      expect (id_on_update).to.equal(id_on_insert)

      const id_after_update = await dbHandler.getColumn ('id', tables.unconfirmed, {email})
      expect (id_after_update).to.equal(id_on_update)

      const token_after_update = await dbHandler.getColumn ('token', tables.unconfirmed, {email})
      expect (token_after_update).to.equal(token_update)
    })
  })

})
