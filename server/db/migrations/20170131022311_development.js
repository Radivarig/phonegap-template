const tableNames = ['users', 'unregistered', 'unconfirmed']

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
