const path = require('path');

const roleService = require(path.resolve(
  './modules/role/services/role.service.js'
));

module.exports = {
  /**
   * Create role
   * @async
   * @param {object} ctx
   */
  createRole: async (ctx) => {
    const role = ctx.request.body;

    const result = await roleService.createRole(role);

    if (result.rowCount) {
      ctx.status = 201;
    }
  },

  /**
   * Delete role
   * @async
   * @param {object} ctx
   */
  deleteRole: async (ctx) => {
    const params = ctx.params;
    const result = await roleService.deleteRole(params.id);

    ctx.body = result.rows;

    if (!result.rowCount) {
      ctx.status = 204;
    }
  },

  /**
   * Edit role
   * @async
   * @param {object} ctx
   */
  editRole: async (ctx) => {
    const params = ctx.params;
    const role = ctx.request.body;

    role.id = params.id;

    const result = await roleService.editRole(role);

    ctx.body = result.rows;
  },

  /**
   * Get role by id
   * @async
   * @param {object} ctx
   */
  getRole: async (ctx) => {
    const params = ctx.params;
    const result = await roleService.getRoleById(params.id);

    ctx.body = result.rows;
  },

  /**
   * Get roles
   * @async
   * @param {object} ctx
   */
  getRoles: async (ctx) => {
    const resultA = await roleService.getRoles();
    const resultB = await roleService.getRoles(
      ctx.request.query.column,
      ctx.request.query.direction,
      ctx.request.query.limit,
      ctx.request.query.offset
    );

    ctx.body = {
      count: resultA.rowCount,
      results: resultB.rows,
    };
  },
};
