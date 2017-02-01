const knex = require('../db/knex.js')
const {dbHandler} = require ('./dbHandler.js')

export const tables = {
  unregistered: 'unregistered',
  unconfirmed: 'unconfirmed',
  users: 'users',
}

export const loginHandler = {
  handleIfUnregisteredUser: async (email: string): Promise<boolean> => {
    const id = await dbHandler.getColumn('id', tables.users, {email})
    if (! id) {
      // TODO send email with confirmation link

      const unreg_id = await dbHandler.getColumn('id', tables.unregistered, {email})
      if (! unreg_id)
        await loginHandler.insertUserToUnregistered(email)
    }
    return (! id)
  },

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

  confirmToken: async (email: string, token: string): Promise<Object | void> => {
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
    return (sessions && sessions[token]) != undefined
  },

}
