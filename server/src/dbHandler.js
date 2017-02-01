const knex = require('../db/knex.js')

export const dbHandler = {
  getColumn: async (select: string, table: string, where: Object = {}) =>
    await knex.select(select).from(table).where(where)
    .then (async (res) => res[0] && res[0][select]),

}
