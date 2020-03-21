const passport = require('koa-passport');
const path = require('path');
const {RateLimiterMemory} = require('rate-limiter-flexible');

const config = require(path.resolve('./config/env/default'));

const rateLimiter = new RateLimiterMemory(config.limiter);

const roleService = require(path.resolve(
  './modules/role/services/role.service.js'
));
const userService = require(path.resolve(
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
  const roles = [];

  const resultA = await userService.getUserById(userId);
  const resultB = await roleService.getRolesByUserId(userId);

  const user = resultA.rows[0];

  resultB.rows.forEach((row) => {
    roles.push(row.role_name);
  });

  if (user) {
    user.roles = roles;
  }

  return user;
};

/**
 * Limit rate
 * @async
 * @param {object} ctx
 * @param {string} key
 */
const limitRate = async (ctx, key) => {
  const limiter = await rateLimiter.get(key);

  if (limiter && limiter.remainingPoints <= 0) {
    ctx.throw(429);
  }

  await rateLimiter.consume(key);
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
    const key = `${ctx.request.body.username}_${ctx.request.ip}`;

    await limitRate(ctx, key);

    return passport.authenticate('local', async (err, user) => {
      if (err || !user) {
        ctx.logout();
        ctx.throw(401);
      }

      ctx.body = user;
      ctx.login(user);

      await rateLimiter.delete(key);
    })(ctx, next);
  },

  /**
   * Logout
   * @async
   * @param {object} ctx
   */
  logout: async (ctx) => {
    session = null;

    ctx.logout();
    ctx.status = 204;
  },
};
