const argon2 = require('argon2');
const owasp = require('owasp-password-strength-test');
const path = require('path');
const validator = require('email-validator');

const service = require(path.resolve(
  './modules/user/services/user.service.js'
));

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

/**
 * Test Email Validity
 * @param {object} ctx
 * @return {array}
 */
const testEmailValidity = (ctx) => {
  const user = ctx.request.body;

  const emailTest = validator.validate(user.email);

  return emailTest;
};

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

module.exports = {
  /**
   * Get user
   * @async
   * @param {object} ctx
   */
  getUser: async (ctx) => {
    const params = ctx.params;
    const response = await service.getUserById(params.id);
    const user = response.rows[0];

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
   * Register User
   * @async
   * @param {object} ctx
   */
  registerUser: async (ctx) => {
    const emailErrors = testEmailValidity(ctx);
    const passwordErrors = testPasswordStrength(ctx);

    if (!emailErrors) {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            detail: 'A valid email must be utlized to register.',
            status: ctx.status,
            title: 'Invalid Email.',
          },
        ],
      };

      return;
    }

    if (!!passwordErrors.length) {
      ctx.status = 400;

      ctx.body = {
        errors: [
          {
            detail: passwordErrors,
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
      const response = await service.registerUser(data);
      const user = response.rows[0];

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
