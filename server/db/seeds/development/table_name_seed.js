exports.seed = (knex, Promise) => {
  const tableName = 'users'
  return knex(tableName).del()
  //.then(() => knex(tableName).insert({email: 'testuser@test.com'}))
}
