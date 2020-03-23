const process = require('process');

let db = {};

if (process.env.DATABASE_URL) {
  const url = require('url');

  const params = url.parse(process.env.DATABASE_URL);

  const auth = params ? params.auth.split(':') : '';

  db = {
    database: params.pathname.split('/')[1] || 'simple_api',
    dialect: process.env.DB_DIALECT || 'postgres',
    host: params.hostname || 'localhost',
    password: auth[1] || '',
    port: params.port || 5432,
    user: auth[0] || '',
  };
} else {
  db = {
    database: process.env.DB_DATABASE || 'simple_api',
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
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
