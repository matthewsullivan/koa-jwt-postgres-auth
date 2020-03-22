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

    console.log(current);

    const result = await service.getCurrent(token.id, current);

    const record = result.rows[0];

    console.log(record);

    ctx.body = record ? record.integer : 0;
    ctx.status = 200;
  },

  /**
   * Get Next
   * @async
   * @param {object} ctx
   */
  getNext: async (ctx) => {
    const token = ctx.body.token;
    const result = await service.getNext(token.id);
    const record = result.rows[0];

    ctx.body = record ? record.integer : 0;
    ctx.status = 200;
  },
};
