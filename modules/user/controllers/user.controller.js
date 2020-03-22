const argon2 = require('argon2');
const owasp = require('owasp-password-strength-test');
const path = require('path');

const service = require(path.resolve(
  './modules/user/services/user.service.js'
));

/**
 * Test password strength
 * @async
 * @param {object} ctx
 * @return {array}
 */
const testPasswordStrength = async (ctx) => {
  const user = ctx.request.body;

  const owaspTest = owasp.test(user.password);

  return owaspTest.errors;
};

/**
 * Encrypt password
 * @async
 * @param {object} user
 * @return {object}
 */
const encryptPassword = async (user) => {
  const salt = await argon2.generateSalt();

  const hashed = await argon2.hash(user.password, salt);

  user.password = hashed;

  return user;
};

module.exports = {
  /**
   * Get user
   * @async
   * @param {object} ctx
   */
  getUser: async (ctx) => {
    const params = ctx.params;
    const result = await service.getUserById(params.id);
    const user = result.rows[0];

    ctx.status = 200;

    ctx.body = user ? user : {message: 'No user found.'};
  },

  /**
   * Register user
   * @async
   * @param {object} ctx
   */
  registerUser: async (ctx) => {
    const errors = await testPasswordStrength(ctx);

    if (!!errors.length) {
      ctx.body = {
        message: 'Password not strong enough.',
        rules: errors,
      };

      ctx.status = 400;

      return;
    }

    const user = ctx.request.body;

    const password = await encryptPassword(user);
    const result = await service.registerUser(password);

    if (result.rowCount) {
      ctx.body = {message: 'Succesfully registered.'};

      ctx.status = 201;
    }
  },
};
