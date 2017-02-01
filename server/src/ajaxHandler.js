const knex = require('../db/knex.js')

export const ajaxHandler = {
  handlePostRequest: async (req, res) => {
    // eslint-disable-next-line
    console.log('request body: ', req.body)

    const packResponse = (returnObject: Object = {}) => {
      Object.assign(returnObject, {
      })
      // eslint-disable-next-line
      console.log('response body: ', returnObject)

      res.send (returnObject)
    }

    const {
      email,
    } = req.body

    if (ajaxHandler.handleIfUnregisteredUser(email)) return packResponse ()
  },

  handleIfUnregisteredUser: async (email: string): Promise<boolean> => {
    const id = await ajaxHandler.getColumn('id', 'users', {email})
    if (! id) {
      // TODO send email with confirmation link

      const unreg_id = await ajaxHandler.getColumn('id', 'unregistered', {email})
      if (! unreg_id)
        await ajaxHandler.insertUserToUnregistered(email)
    }
    return (! id)
  },

  insertUserToUnregistered: async (email: string): Promise<number> =>
  (await knex.insert({email}).into('unregistered').returning('id'))[0],

  getColumn: async (select: string, table: string, where: Object = {}) =>
    await knex.select(select).from(table).where(where)
    .then (async (res) => res[0] && res[0][select]),

}
