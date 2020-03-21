const argon2 = require('argon2');
const owasp = require('owasp-password-strength-test');
const path = require('path');

const roleService = require(path.resolve(
  './modules/role/services/role.service.js'
));
const userRoleService = require(path.resolve(
  './modules/user-role/services/user-role.service.js'
));
const userService = require(path.resolve(
  './modules/user/services/user.service.js'
));

/**
 * Check user password
 * @async
 * @param {object} ctx
 * @return {boolean}
 */
const checkUserPassword = async (ctx) => {
  const user = ctx.request.body;

  const owaspTest = owasp.test(user.password);

  if (owaspTest.errors.length) {
    ctx.throw(422);
  }

  return true;
};

/**
 * Get user roles
 * @async
 * @param {number} id
 * @return {array}
 */
const getUserRoles = async (id) => {
  const result = await roleService.getRolesByUserId(id);
  const roles = [];

  for (const role of result.rows) {
    roles.push(role);
  }

  return roles;
};

/**
 * Hash user password
 * @async
 * @param {object} user
 * @return {object}
 */
const hashUserPassword = async (user) => {
  const salt = await argon2.generateSalt();

  const hashed = await argon2.hash(user.password, salt);

  user.password = hashed;

  return user;
};

module.exports = {
  /**
   * Check user by email
   * @async
   * @param {object} ctx
   */
  checkUserByEmail: async (ctx) => {
    const email = ctx.params.email;
    const result = await userService.getUserByEmail(email);

    ctx.body = result.rows[0];
  },

  /**
   * Check user by username
   * @async
   * @param {object} ctx
   */
  checkUserByUsername: async (ctx) => {
    const username = ctx.params.username;

    const result = await userService.getUserByUsername(username);

    ctx.body = result.rows[0];
  },

  /**
   * Create user
   * @async
   * @param {object} ctx
   */
  createUser: async (ctx) => {
    const user = ctx.request.body;

    const roles = JSON.parse(user.roles);

    let result;

    if (await checkUserPassword(ctx)) {
      const hashed = await hashUserPassword(user);

      result = await userService.createUser(hashed);
    }

    for (const roleId of roles) {
      await userRoleService.createUserRole(result.rows[0], roleId);
    }

    if (result.rowCount) {
      ctx.status = 201;
    }
  },

  /**
   * Delete user
   * @async
   * @param {object} ctx
   */
  deleteUser: async (ctx) => {
    const params = ctx.params;
    const result = await userService.deleteUser(params.id);

    ctx.body = result.rows;

    if (!result.rowCount) {
      ctx.status = 204;
    }
  },

  /**
   * Edit user
   * @async
   * @param {object} ctx
   */
  editUser: async (ctx) => {
    const params = ctx.params;
    const user = ctx.request.body;

    user.id = params.id;

    const result = await userService.editUser(user);

    if (user.roles) {
      const roles = JSON.parse(user.roles);

      await userRoleService.deleteUserRoles(result.rows[0].id);

      for (const roleId of roles) {
        await userRoleService.createUserRole(result.rows[0], roleId);
      }

      result.rows[0].roles = await getUserRoles(user.id);
    }

    ctx.body = result.rows[0];
  },

  /**
   * Get user
   * @async
   * @param {object} ctx
   */
  getUser: async (ctx) => {
    const params = ctx.params;
    const result = await userService.getUserById(params.id);
    const user = result.rows[0];

    if (user) {
      user.roles = await getUserRoles(params.id);
    }

    ctx.body = user;
  },

  /**
   * Get users
   * @async
   * @param {object} ctx
   */
  getUsers: async (ctx) => {
    const query = ctx.request.query;
    const users = [];

    const resultA = await userService.getUsers(JSON.parse(query.search));
    const resultB = await userService.getUsers(
      JSON.parse(query.search),
      ctx.request.query.column,
      ctx.request.query.direction,
      ctx.request.query.limit,
      ctx.request.query.offset
    );

    for (const user of resultB.rows) {
      user.roles = await getUserRoles(user.id);

      users.push(user);
    }

    ctx.body = {
      rows: users,
      totalCount: resultA.rowCount,
    };
  },

  /**
   * Update password
   * @async
   * @param {object} ctx
   */
  updatePassword: async (ctx) => {
    const body = ctx.request.body;
    const params = ctx.params;
    const resultA = await userService.getUserById(params.id);
    const user = resultA.rows[0];

    user.password = body.password;

    await checkUserPassword(ctx);

    const hashed = await hashUserPassword(user);
    const resultB = await userService.updateUserPassword(hashed);

    if (resultB.rowCount) {
      ctx.status = 204;
    }
  },

  /**
   * Update profile
   * @async
   * @param {object} ctx
   */
  updateProfile: async (ctx) => {
    const body = ctx.request.body;
    const roles = [];

    body.id = ctx.params.id;

    const resultA = await userService.editUser(body);
    const resultB = await roleService.getRolesByUserId(body.id);

    resultB.rows.forEach((row) => {
      roles.push(row.role_name);
    });

    const user = resultA.rows[0];

    user.roles = roles;

    ctx.body = user;
  },
};
