require("babel-register")

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/test_database',
    migrations: {directory: './db/migrations'},
    seeds: {directory: './db/seeds/test'},
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/development_database',
    migrations: {directory: './db/migrations'},
    seeds: {directory: './db/seeds/development'},
  },
  production: {
    client: 'pg',
    // eslint-disable-next-line no-undef
    connection: process.env.DATABASE_URL,
    migrations: {directory: './db/migrations'},
    seeds: {directory: './db/seeds/production'},
  },
}
