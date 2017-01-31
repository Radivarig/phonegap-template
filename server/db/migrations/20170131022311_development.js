const tableNames = ['users', 'unregistered']

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
    })
  }

}

exports.down = async (knex) => {
  for (const tableName of tableNames)
    await knex.schema.dropTableIfExists(tableName)
}
