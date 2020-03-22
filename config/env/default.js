import {env} from 'process';

const config = {
  db: {
    database: env.DB_DATABASE || 'simple_api',
    dialect: env.DB_DIALECT || 'postgres',
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT || 5432,
  },
  secret: env.JWT_SECRET || 'jwt-secret',
  server: {
    port: env.SERVER_PORT || 3000,
  },
};

export default config;
