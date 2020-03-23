const process = require('process');

let db = {};

if (process.env.DATABASE_URL) {
  const url = require('url');

  const params = url.parse(process.env.DATABASE_URL);

  const auth = params.auth.split(':');

  db = {
    database: params.pathname.split('/')[1],
    dialect: process.env.DB_DIALECT,
    host: params.hostname,
    password: auth[1],
    port: params.port,
    user: auth[0],
  };
} else {
  db = {
    database: 'simple_api',
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
  };
}

const config = {
  db,
  secret: process.env.JWT_SECRET || 'jwt-secret',
  server: {
    port: process.env.PORT || 3000,
  },
};

module.exports = config;
