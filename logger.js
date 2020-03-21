const log4js = require('log4js');

log4js.configure({
  appenders: {
    application: {
      backups: 3,
      filename: './logs/application.log',
      layout: {
        type: 'basic',
      },
      maxLogSize: 10485760,
      type: 'file',
    },
    console: {type: 'console'},
  },
  categories: {
    production: {
      appenders: ['application'],
      level: 'info',
    },
    development: {
      appenders: ['console', 'application'],
      level: 'trace',
    },
    default: {
      appenders: ['console'],
      level: 'trace',
    },
  },
});

module.exports = log4js;
