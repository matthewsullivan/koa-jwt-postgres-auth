const config = {
  db: {
    database: process.env.DB_DATABASE || 'simple_prod',
  },
  server: {
    port: 80,
  },
};

module.exports = config;
