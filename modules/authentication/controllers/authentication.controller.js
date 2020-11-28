const jwt = require('jsonwebtoken');
const passport = require('koa-passport');
const path = require('path');

const config = require(path.resolve('./config/env/default'));

const service = require(path.resolve(
  './modules/user/services/user.service.js'
));

require(path.resolve('./config/lib/passport/strategies/local'));

/**
 * Get User By Id
 * @async
 * @param {number} userId
 * @return {object}
 */
const getUserById = async (userId) => {
  const response = await service.getUserById(userId);
  const user = response.rows[0];

  return user;
};

/**
 * Deserialize User
 * @callback done
 * @param {function}
 */
passport.deserializeUser(async (userId, done) => {
  const user = await getUserById(userId);

  user ? done(null, user) : done('Unauthorized');
});

/**
 * Serialize User
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
          ctx.status = 401;

          ctx.body = {
            errors: [
              {
                detail: 'Invalid credentails supplied.',
                status: ctx.status,
                title: 'Authentication Failed.',
              },
            ],
          };

          return;
        }

        const token = jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          config.secret,
          {
            expiresIn: config.expiration,
          }
        );

        ctx.body = {
          data: {
            attributes: {
              access_token: token,
              expires_in: config.expiration,
              token_type: 'Bearer',
            },
            detail: 'Logged in and generated bearer token.',
            title: 'Succesful Login.',
            type: 'token',
          },
        };

        ctx.status = 200;
      }
    )(ctx, next);
  },
};
