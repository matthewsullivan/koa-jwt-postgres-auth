const path = require('path');

const service = require(path.resolve(
  './modules/user-integer/services/user-integer.service.js'
));

module.exports = {
  /**
   * Get Current
   * @async
   * @param {object} ctx
   */
  getCurrent: async (ctx) => {
    const current = ctx.request.body.current;
    const token = ctx.token;

    if (current < 0) {
      ctx.body = {
        message: 'Current must be greator than 0',
      };

      ctx.status = 400;

      return;
    }

    const result = await service.getCurrent(token.id, current);

    ctx.body = result.rows[0];
    ctx.status = 200;
  },

  /**
   * Get Next
   * @async
   * @param {object} ctx
   */
  getNext: async (ctx) => {
    const token = ctx.token;

    const result = await service.getNext(token.id);

    ctx.body = result.rows[0];
    ctx.status = 200;
  },
};
