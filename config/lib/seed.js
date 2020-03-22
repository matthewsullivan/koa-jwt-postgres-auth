const path = require('path');

const userController = require(path.resolve(
  './modules/user/controllers/user.controller.js'
));

const seed = (() => {
  /**
   * Register user
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
      password: '!1A2b3C4d!',
      username: 'johndoe',
    };

    ctx.request.body = user;

    await userController.registerUser(ctx);
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
