exports.seed = (knex, Promise) =>
knex('table_name').del()
  .then(() => knex('table_name').insert({string_field: 'str'}))
