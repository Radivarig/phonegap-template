const knex = require('../db/knex.js')
const {dbHandler} = require ('./dbHandler.js')
const randToken = require ('rand-token')

export const tables = {
  unregistered: 'unregistered',
  unconfirmed: 'unconfirmed',
  users: 'users',
}

export const loginHandler = {
  getIsUserRegistered: async (email: string): Promise<boolean> =>
    (await dbHandler.getColumn('id', tables.users, {email})) !== undefined,

  insertUserToUnregistered: async (email: string): Promise<number> =>
    (await knex.insert({email}).into(tables.unregistered).returning('id'))[0],

  insertOrUpdateTokenToUnconfirmed: async (email: string, token: string): Promise<number> => {
    let id = await dbHandler.getColumn ('id', tables.unconfirmed, {email})
    if (! id)
      id = (await knex.insert({email, token}).into(tables.unconfirmed).returning('id'))[0]
    else
      await knex(tables.unconfirmed).where({email}).update({token})
    return id
  },

  handleRequestLoginToken: async (email): Promise<string> => {
    // if unregistered add to table unregistered
    if (! await loginHandler.getIsUserRegistered(email))
      await loginHandler.insertUserToUnregistered(email)

    // add to table unconfirmed
    const token = randToken.generate(8)
    await loginHandler.insertOrUpdateTokenToUnconfirmed(email, token)
    return token
  },

  confirmLoginToken: async (email: string, token: string): Promise<Object | void> => {
    let id = await dbHandler.getColumn ('id', tables.users, {email})
    const id_unconfirmed = await dbHandler.getColumn ('id', tables.unconfirmed, {email})
    const token_unconfirmed = await dbHandler.getColumn('token', tables.unconfirmed, {email})

    if (! id && ! id_unconfirmed)
      return {error: {message: 'user_not_found'}}

    if (token_unconfirmed !== token)
      return {error: {message: 'token_mismatch'}}

    // remove from unconfirmed
    await knex(tables.unconfirmed).where({email}).del()
    // add new user to table users
    if (! id)
      id = (await knex.insert({email}).into(tables.users).returning('id'))[0]

    // add session
    const sessions = await dbHandler.getColumn ('sessions', tables.users, {email})

    // if called multiple times with same token
    if (sessions[token])
      return {error: {message: 'token_consumed'}}

    // TODO add timestamp, agent
    sessions[token] = {}
    await knex(tables.users).where({email}).update({sessions})
  },

  getSessionValidity: async (email: string, token: string): Promise<boolean> => {
    const sessions = await dbHandler.getColumn ('sessions', tables.users, {email})
    return (sessions && sessions[token]) !== undefined
  },

  setData: async (email: string, toAssign: Object): void => {
    const data = await dbHandler.getColumn ('data', tables.users, {email})
    Object.assign (data, toAssign)
    await knex(tables.users).where({email}).update({data})
  },

  getData: async (email: string, propList: Array<string> | string): Promise<Object> => {
    const data = await dbHandler.getColumn ('data', tables.users, {email})
    const returnData = {}

    if (typeof (propList) === 'string')
      propList = [propList]

    for (const p of propList)
      returnData[p] = data[p]

    return returnData
  },

}
