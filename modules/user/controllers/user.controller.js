const argon2 = require('argon2');
const owasp = require('owasp-password-strength-test');
const path = require('path');

const service = require(path.resolve(
  './modules/user/services/user.service.js'
));

/**
 * Test password strength
 * @param {object} ctx
 * @return {array}
 */
const testPasswordStrength = (ctx) => {
  const user = ctx.request.body;

  const owaspTest = owasp.test(user.password);

  return owaspTest.errors;
};

/**
 * Encrypt password
 * @async
 * @param {string} password
 * @return {object}
 */
const encryptPassword = async (password) => {
  const salt = await argon2.generateSalt();

  const encrypted = await argon2.hash(password, salt);

  return encrypted;
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

    if (!user) {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            status: ctx.status,
            title: 'No User Found.',
          },
        ],
      };

      return;
    }

    ctx.body = {
      data: {
        attributes: {
          user: user,
        },
        id: 2,
        type: 'user',
      },
    };

    ctx.status = 200;
  },

  /**
   * Register user
   * @async
   * @param {object} ctx
   */
  registerUser: async (ctx) => {
    const errors = testPasswordStrength(ctx);

    if (!!errors.length) {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            detail: errors,
            status: ctx.status,
            title: 'Password Strength.',
          },
        ],
      };

      return;
    }

    const data = ctx.request.body;

    data.password = await encryptPassword(data.password);

    try {
      const result = await service.registerUser(data);
      const user = result.rows[0];

      await service.setUserInteger(user.id);

      ctx.body = {
        data: {
          attributes: {
            user: user,
          },
          title: 'Succesfully Registered.',
          type: 'user',
        },
      };

      ctx.status = 201;
    } catch {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            detail: 'A user with the same email exists.',
            status: ctx.status,
            title: 'User exists.',
          },
        ],
      };
    }
  },
};
