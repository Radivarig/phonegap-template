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

}
