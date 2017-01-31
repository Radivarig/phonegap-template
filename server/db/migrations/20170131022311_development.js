exports.up = (knex, Promise) =>
  knex.schema.createTable('table_name', (table) => {
    table.increments()
    table.string('string_field').notNullable().unique()
  })

exports.down = (knex, Promise) =>
  knex.schema.dropTable('shows')
