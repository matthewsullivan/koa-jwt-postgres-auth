const Acl = require('acl');
const router = require('koa-router')();
const path = require('path');

const acl = new Acl(new Acl.memoryBackend());

const roleController = require(path.resolve(
  './modules/role/controllers/role.controller.js'
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
        resources: '/api/v1/roles',
      },
      {
        permissions: ['delete', 'get', 'post'],
        resources: '/api/v1/roles/:id',
      },
    ],
    roles: ['admin'],
  },
]);

router
  .del('/api/v1/roles/:id', secured, roleController.deleteRole)

  .get('/api/v1/roles', secured, roleController.getRoles)
  .get('/api/v1/roles/:id', secured, roleController.getRole)

  .post('/api/v1/roles', secured, roleController.createRole)
  .post('/api/v1/roles/:id', secured, roleController.editRole);

module.exports = router;
