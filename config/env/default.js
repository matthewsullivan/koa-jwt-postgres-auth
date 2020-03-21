const path = require('path');
const process = require('process');

const envConfig = require(path.resolve(
  './config/env/' + process.env.NODE_ENV + '.js'
));

const mainConfig = {
  db: {
    database: process.env.DB_DATABASE || 'simple_dev',
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  },
  limiter: {
    duration: 60 * 30,
    points: 6,
  },
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  session: {
    httpOnly: true,
    key: 'koa:sess',
    maxAge: 12 * 60 * 60 * 1000,
    overwrite: true,
    signed: true,
  },
};

const config = Object.assign(mainConfig, envConfig);

module.exports = config;
