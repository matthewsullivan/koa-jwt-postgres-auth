const passport = require('koa-passport');
const path = require('path');
const router = require('koa-router')();

const controller = require(path.resolve(
  './modules/user-integer/controllers/user-integer.controller.js'
));

require(path.resolve('./config/lib/passport/strategies/jwt'));

/**
 * Secured
 * @async
 * @callback next
 * @param {object} ctx
 * @param {function} next
 * @return {boolean|function}
 */
const secured = async (ctx, next) => {
  return passport.authenticate(
    'jwt',
    {session: false},
    async (error, token) => {
      if (error || !token) {
        ctx.status = 401;

        ctx.body = {
          errors: [
            {
              detail: 'Must be logged in to access requested resource.',
              status: ctx.status,
              title: 'Authentication Failed.',
            },
          ],
        };

        return;
      }

      ctx.token = token;
      ctx.status = 200;

      return next();
    }
  )(ctx, next);
};

router
  .get('/api/v1/current', secured, controller.getCurrent)
  .get('/api/v1/next', secured, controller.upsertNext)

  .put('/api/v1/current', secured, controller.upsertCurrent);

module.exports = router;
