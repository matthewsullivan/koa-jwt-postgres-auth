const jwt = require('jsonwebtoken');
const passport = require('koa-passport');
const path = require('path');

const config = require(path.resolve('./config/env/default'));

const service = require(path.resolve(
  './modules/user/services/user.service.js'
));

require(path.resolve('./modules/authentication/strategies/local.js'));

/**
 * Get user by id
 * @async
 * @param {number} userId
 * @return {object}
 */
const getUserById = async (userId) => {
  const result = await service.getUserById(userId);
  const user = result.rows[0];

  return user;
};

/**
 * Deserialize user
 * @callback done
 * @param {function}
 */
passport.deserializeUser(async (userId, done) => {
  const user = await getUserById(userId);

  user ? done(null, user) : done('Unauthorized');
});

/**
 * Serialize user
 * @callback done
 * @param {function}
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

module.exports = {
  /**
   * Login
   * @async
   * @param {object} ctx
   * @param {function} next
   * @return {object}
   */
  login: async (ctx, next) => {
    return passport.authenticate(
      'local',
      {session: false},
      async (error, user) => {
        if (error || !user) {
          ctx.body = {message: 'Authentication failed.'};
          ctx.status = 401;

          return;
        }

        const token = jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          config.secret,
          {
            expiresIn: '1h',
          }
        );

        ctx.body = {
          message: 'Succesfully logged in.',
          token: token,
        };

        ctx.status = 200;
      }
    )(ctx, next);
  },
};
