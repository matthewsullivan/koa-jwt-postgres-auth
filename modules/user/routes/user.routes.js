const passport = require('koa-passport');
const path = require('path');
const router = require('koa-router')();

const controller = require(path.resolve(
  './modules/user/controllers/user.controller.js'
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
  .get('/api/v1/profile/:id', secured, controller.getUser)

  .post('/api/v1/user/password', secured, controller.updatePassword)
  .post('/api/v1/users/profile/:id', secured, controller.updateProfile)
  .post('/api/v1/register', controller.registerUser);

module.exports = router;
