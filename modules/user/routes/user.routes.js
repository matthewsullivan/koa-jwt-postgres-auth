const Acl = require('acl');
const router = require('koa-router')();
const path = require('path');

const acl = new Acl(new Acl.memoryBackend());

const userController = require(path.resolve(
  './modules/user/controllers/user.controller.js'
));

/**
 * Secured
 * @async
 * @callback next
 * @param {object} ctx
 * @param {function} next
 * @return {boolean|function}
 */
const secured = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    if (ctx.state.user.id === ctx.params.id) {
      ctx.state.user.roles.push('self');
    }

    const isAllowed = await acl.areAnyRolesAllowed(
      ctx.state.user.roles,
      ctx._matchedRoute,
      ctx.method.toLowerCase(),
      (err, status) => {
        if (!err) {
          return status;
        }
      }
    );

    if (isAllowed) {
      return next();
    }
  }

  ctx.status = 401;
};

acl.allow([
  {
    allows: [
      {
        permissions: ['get', 'post'],
        resources: '/api/v1/users',
      },
      {
        permissions: ['delete', 'put'],
        resources: '/api/v1/users/:id',
      },
    ],
    roles: ['admin'],
  },
  {
    allows: [
      {
        permissions: ['post'],
        resources: '/api/v1/users/password/:id',
      },
      {
        permissions: ['get'],
        resources: '/api/v1/users/:id',
      },
      {
        permissions: ['post'],
        resources: '/api/v1/users/profile/:id',
      },
    ],
    roles: ['admin', 'self'],
  },
  {
    allows: [
      {
        permissions: ['get'],
        resources: '/api/v1/users/email/:email',
      },
      {
        permissions: ['get'],
        resources: '/api/v1/users/username/:username',
      },
    ],
    roles: ['admin', 'self', 'user'],
  },
]);

router
  .del('/api/v1/users/:id', secured, userController.deleteUser)

  .get('/api/v1/users', secured, userController.getUsers)
  .get('/api/v1/users/:id', secured, userController.getUser)
  .get('/api/v1/users/email/:email', secured, userController.checkUserByEmail)
  .get(
    '/api/v1/users/username/:username',
    secured,
    userController.checkUserByUsername
  )

  .post('/api/v1/users', secured, userController.createUser)
  .post('/api/v1/users/password/:id', secured, userController.updatePassword)
  .post('/api/v1/users/profile/:id', secured, userController.updateProfile)

  .put('/api/v1/users/:id', secured, userController.editUser);

module.exports = router;
