const path = require('path');

const controller = require(path.resolve(
  './modules/user/controllers/user.controller.js'
));

const seed = (() => {
  /**
   * Register User
   * @async
   */
  const registerUser = async () => {
    console.log(`registerUser [${new Date().toString()}]`);

    const ctx = {
      request: {
        body: {},
      },
    };

    const user = {
      email: 'johndoe@localhost.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '(a1B2c3D4e5F6g)',
    };

    ctx.request.body = user;

    await controller.registerUser(ctx);
  };

  /**
   * Init
   * @async
   */
  const init = async () => {
    await registerUser();
  };

  return {
    init: init,
  };
})();

seed.init().then(process.exit);
