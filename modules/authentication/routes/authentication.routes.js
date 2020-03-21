const router = require('koa-router')();
const path = require('path');

const authController = require(path.resolve(
  './modules/authentication/controllers/authentication.controller.js'
));

router
  .post('/api/v1/login', authController.login)
  .post('/api/v1/logout', authController.logout);

module.exports = router;
