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

  describe('handleIfUnregisteredUser', () => {
    it('should insert new user to table `unregistered`', async () => {
      const id_users = await dbHandler.getColumn ('id', tables.users, {email})
      expect (id_users).to.equal(undefined)

      const unregisteredUser: boolean = await loginHandler.handleIfUnregisteredUser(email)
      expect (unregisteredUser).to.equal(true)

      const id_unregistered = await dbHandler.getColumn ('id', tables.unregistered, {email})
      expect (id_unregistered).to.not.equal(undefined)
    })
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

  describe('confirmToken', () => {
    it('should move new user from table `unregistered` to table `users`', async () => {
      // adding new user to unconfirmed
      const token = 'token'
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)

      // new user should not exist in users
      const id_users_before = await dbHandler.getColumn ('id', tables.users, {email})
      expect (id_users_before).to.equal(undefined)

      await loginHandler.confirmToken (email, token)

      // new user should be removed from unregistered
      const id_unregistered_after = await dbHandler.getColumn ('id', tables.unregistered, {email})
      expect (id_unregistered_after).to.equal(undefined)

      // new user should be added to table users
      const id_users_after = await dbHandler.getColumn ('id', tables.users, {email})
      expect (id_users_after).to.not.equal(undefined)

    })

    it('should return error `user_not_found` if user is not in table `users` or table `unconfirmed`', async () => {
      const res = await loginHandler.confirmToken (email, '')
      expect (res).to.be.an('object')
      expect (res).to.have.property('error')
      expect (res.error.message).to.equal('user_not_found')
    })

    it('should return error `token_mismatch` if tokens do not match', async () => {
      // adding new user to unconfirmed
      const token = 'token'
      const token_different = 'token_different'
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)

      const res = await loginHandler.confirmToken (email, token_different)
      expect (res).to.be.an('object')
      expect (res).to.have.property('error')
      expect (res.error.message).to.equal('token_mismatch')
    })

    it('should insert new session to table `sessions`', async () => {
      const token = 'token'
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
      await loginHandler.confirmToken (email, token)

      const sessions = await dbHandler.getColumn ('sessions', tables.users, {email})
      expect (sessions).to.have.property(token)
    })

    it('should return error `token_consumed` if token exists in sessions', async () => {
      const token = 'token'

      // first login
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
      await loginHandler.confirmToken (email, token)

      // second login with same token
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
      const res = await loginHandler.confirmToken (email, token)

      expect (res).to.be.an('object')
      expect (res).to.have.property('error')
      expect (res.error.message).to.equal('token_consumed')
    })


  })

})
