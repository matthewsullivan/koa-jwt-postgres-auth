const router = require('koa-router')();
const path = require('path');

const controller = require(path.resolve(
  './modules/authentication/controllers/authentication.controller.js'
));

router
  .post('/api/v1/login', controller.login)
  .post('/api/v1/logout', controller.logout);

module.exports = router;
