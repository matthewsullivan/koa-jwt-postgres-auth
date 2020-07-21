const process = require('process');
const url = require('url');

let db = {};

if (process.env.DATABASE_URL) {
  const params = url.parse(process.env.DATABASE_URL);

  const auth = params.auth.split(':');
  const database = params.pathname.split('/')[1];
  const password = auth[1];
  const user = auth[0];

  db = {
    database: database,
    dialect: 'postgres',
    host: params.hostname,
    password: password,
    port: params.port,
    user: user,
  };
} else {
  db = {
    database: 'kjpa_test',
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
  };
}

const config = {
  db,
  expiration: process.env.JWT_EXPIRATION || '1h',
  secret: process.env.JWT_SECRET || 'jwt-secret',
  server: {
    port: process.env.PORT || 3000,
  },
};

module.exports = config;
