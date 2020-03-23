const process = require('process');

const config = {
  db: {
    database: process.env.DB_DATABASE || 'simple_api',
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  },
  secret: process.env.JWT_SECRET || 'jwt-secret',
  server: {
    port: process.env.PORT || 3000,
  },
};

module.exports = config;

// postgres://kpnzhynlfunnim:f76e2b69cb1086ad39b213f749c3f1f2e4a587f10701bf796db48a6819ef3d65@ec2-18-209-187-54.compute-1.amazonaws.com:5432/dlv2u18bgq5ab
