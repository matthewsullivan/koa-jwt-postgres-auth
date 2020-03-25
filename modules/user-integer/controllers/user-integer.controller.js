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
    const response = await service.getCurrent(ctx.token.id);

    ctx.body = {
      data: {
        attributes: {
          integer: response.rows.length ? response.rows[0].integer : 0,
        },
        type: 'integer',
      },
    };

    ctx.status = 200;
  },

  /**
   * Upsert Current
   * @async
   * @param {object} ctx
   */
  upsertCurrent: async (ctx) => {
    const current = ctx.request.body.current;

    if (!current || current <= 0) {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            detail: 'Value must be greater than 0.',
            status: ctx.status,
            title: 'Unaccepted Type.',
          },
        ],
      };

      return;
    }

    const response = await service.upsertCurrent(ctx.token.id, current);

    ctx.body = {
      data: {
        attributes: {
          integer: response.rows[0].integer,
        },
        type: 'integer',
      },
    };

    ctx.status = 200;
  },

  /**
   * Upsert Next
   * @async
   * @param {object} ctx
   */
  upsertNext: async (ctx) => {
    const response = await service.upsertNext(ctx.token.id);

    ctx.body = {
      data: {
        attributes: {
          integer: response.rows[0].integer,
        },
        type: 'integer',
      },
    };

    ctx.status = 200;
  },
};
