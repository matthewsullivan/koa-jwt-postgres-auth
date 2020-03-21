const Acl = require('acl');
const router = require('koa-router')();
const path = require('path');

const acl = new Acl(new Acl.memoryBackend());

const exampleController = require(path.resolve(
  './modules/example/controllers/example.controller.js'
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
        permissions: '*',
        resources: '/api/v1/examples',
      },
      {
        permissions: '*',
        resources: '/api/v1/examples/:id',
      },
      {
        permissions: '*',
        resources: '/api/v1/examples/name/:name',
      },
    ],
    roles: ['admin', 'user'],
  },
]);

router
  .del('/api/v1/examples/:id', secured, exampleController.deleteExample)

  .get('/api/v1/examples', secured, exampleController.getExamples)
  .get('/api/v1/examples/:id', secured, exampleController.getExample)
  .get(
    '/api/v1/examples/name/:name',
    secured,
    exampleController.getExampleByName
  )

  .post('/api/v1/examples', secured, exampleController.createExample)

  .put('/api/v1/examples/:id', secured, exampleController.editExample);

module.exports = router;
