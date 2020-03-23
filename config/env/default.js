const process = require('process');

const config = {
  db: {
    connection: process.env.DATABASE_URL,
    database: process.env.DB_DATABASE || 'simple_api',
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    url: process.env.DATABASE_URL,
  },
  secret: process.env.JWT_SECRET || 'jwt-secret',
  server: {
    port: process.env.PORT || 3000,
  },
};

module.exports = config;
