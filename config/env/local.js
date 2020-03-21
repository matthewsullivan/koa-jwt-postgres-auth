const config = {
  db: {
    database: process.env.DB_DATABASE || 'simple_dev',
  },
  server: {
    port: 80,
  },
};

module.exports = config;
