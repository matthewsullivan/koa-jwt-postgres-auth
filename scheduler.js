const nodeCron = require('node-cron');

/**
 * Cron
 */
const cron = () => {
  nodeCron.schedule('*/5 * * * *', () => {
    console.log('scheduler :: cron');
  });
};

module.exports = {
  /**
   * Initialize
   * @async
   */
  initialize: async () => {
    cron();
  },
};
