const passport = require('koa-passport');
const path = require('path');
const router = require('koa-router')();

const controller = require(path.resolve(
  './modules/user/controllers/user.controller.js'
));

require(path.resolve('./modules/user/strategies/jwt.js'));

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
        ctx.body = {message: 'Authentication failed.'};
        ctx.status = 401;

        return;
      }

      ctx.status = 200;

      return next();
    }
  )(ctx, next);
};

router
  .get('/api/v1/profile/:id', secured, controller.getUser)

  .post('/api/v1/register', controller.registerUser);

module.exports = router;
