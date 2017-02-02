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
const doLogin = async (email: string, token: string) => {
  await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
  return await loginHandler.confirmLoginToken (email, token)
}

describe('API loginHandler.js', () => {

  describe('getIsUserRegistered', () => {
    it('should return correct bool', async () => {
      expect (await loginHandler.getIsUserRegistered(email)).to.equal(false)
      await doLogin(email, 'token')
      expect (await loginHandler.getIsUserRegistered(email)).to.equal(true)
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

  describe('handleRequestLoginToken', () => {
    it('should add user to table `unconfirmed`', async () => {
      await loginHandler.handleRequestLoginToken(email)
      const id_unconfirmed = await dbHandler.getColumn('id', tables.unconfirmed, {email})
      expect (id_unconfirmed).to.not.equal(undefined)
    })

    it('should not add new user to table `users`', async () => {
      await loginHandler.handleRequestLoginToken(email)
      const id_users = await dbHandler.getColumn('id', tables.users, {email})
      expect (id_users).to.equal(undefined)
    })

    it('should insert/update new user to table `unregistered`', async () => {
      await loginHandler.handleRequestLoginToken(email)
      const id_unregistered = await dbHandler.getColumn('id', tables.unregistered, {email})
      expect (id_unregistered).to.not.equal(undefined)

      // second request
      await loginHandler.handleRequestLoginToken(email)
      const items = await knex(tables.unregistered).select('id').where({email})
      expect (items.length).to.equal(1)
    })

    it('should return token string', async () => {
      const token: string = await loginHandler.handleRequestLoginToken(email)
      expect (token).to.be.a('string')
    })

  })  

  describe('confirmLoginToken', () => {
    it('should move new user from table `unregistered` to table `users`', async () => {
      // adding new user to unconfirmed
      const token = 'token'

      // new user should not exist in users
      const id_users_before = await dbHandler.getColumn ('id', tables.users, {email})
      expect (id_users_before).to.equal(undefined)

      await doLogin(email, token)

      // new user should be removed from unregistered
      const id_unregistered_after = await dbHandler.getColumn ('id', tables.unregistered, {email})
      expect (id_unregistered_after).to.equal(undefined)

      // new user should be added to table users
      const id_users_after = await dbHandler.getColumn ('id', tables.users, {email})
      expect (id_users_after).to.not.equal(undefined)

    })

    it('should return error `user_not_found` if user is not in table `users` or table `unconfirmed`', async () => {
      const res = await loginHandler.confirmLoginToken ('anyemail@test.com', 'any_token')
      expect (res).to.be.an('object')
      expect (res).to.have.property('error')
      expect (res.error.message).to.equal('user_not_found')
    })

    it('should return error `token_mismatch` if tokens do not match', async () => {
      // adding new user to unconfirmed
      const token = 'token'
      const token_different = token + '_different'

      // try to confirm login with different token
      await loginHandler.insertOrUpdateTokenToUnconfirmed (email, token)
      const res = await loginHandler.confirmLoginToken (email, token_different)

      expect (res).to.be.an('object')
      expect (res).to.have.property('error')
      expect (res.error.message).to.equal('token_mismatch')
    })

    it('should insert new session to table `sessions`', async () => {
      const {session} = await doLogin(email, 'token')
      const sessions = await dbHandler.getColumn ('sessions', tables.users, {email})
      expect (sessions).to.have.property(session)
    })

    it('should return session string', async () => {
      const {session} = await doLogin(email, 'token')
      const sessions = await dbHandler.getColumn ('sessions', tables.users, {email})
      expect (sessions).to.have.property(session)
    })


  })

  describe('getSessionValidity', () => {
    it('should return true if token is found in sessions, otherwise false', async () => {
      const email_different = 'different_' + email

      const {session} = await doLogin(email, 'token')
      const session_different = session + '_different'

      let is_session_valid = await loginHandler.getSessionValidity(email, session)
      expect (is_session_valid).to.equal(true)

      // different email
      is_session_valid = await loginHandler.getSessionValidity(email_different, session)
      expect (is_session_valid).to.equal(false)

      // different session
      is_session_valid = await loginHandler.getSessionValidity(email, session_different)
      expect (is_session_valid).to.equal(false)
    })
  })

  describe('getData', () => {
    it('should return an object with keys from arg `data_properties`', async () => {
      await doLogin(email, 'token')
      const list_of_properties = ['list', 'of', 'properties']
      const data_multiple = await loginHandler.getData(email, list_of_properties)
      expect (data_multiple).to.be.an('object')
      for (const p of list_of_properties)
        expect (data_multiple).to.have.property(p)
    })
  })

  describe('setData', () => {
    it('should assign passed object to json `data`', async () => {
      await doLogin(email, 'token')

      const toAssign = {
        num_val: 45,
        str_val: 'str',
        bool_val: false,
        obj_val: {a: 1},
      }
      const toAssignKeys = Object.keys(toAssign)

      await loginHandler.setData(email, toAssign)
      const data = await loginHandler.getData(email, toAssignKeys)
      expect (data).to.be.an('object')

      // json equality
      expect (JSON.stringify(data)).to.equal(JSON.stringify(toAssign))
    })
  })

})
