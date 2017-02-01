const {tables} = require('../../src/loginHandler.js')

const tableNames = []
for (const n in tables)
  tableNames.push (tables[n])

exports.up = async (knex) => {
  for (const tableName of tableNames) {
    await knex.schema.createTableIfNotExists (tableName, (table) => {
      if (tableName == 'users') {
        table.increments('id').primary()
        table.string('email')
        table.json('data').defaultTo('{}')
      }
      else if (tableName == 'unregistered') {
        table.increments('id').primary()
        table.string('email')
      }
      else if (tableName == 'unconfirmed') {
        table.increments('id').primary()
        table.string('email')
        table.string('token')
      }
      else throw `unmatched table name: \`${tableName}\``
    })
  }

}

exports.down = async (knex) => {
  for (const tableName of tableNames)
    await knex.schema.dropTableIfExists(tableName)
}
