const fs = require('fs');
const path = require('path');

const roleController = require(path.resolve(
  './modules/role/controllers/role.controller.js'
));
const userController = require(path.resolve(
  './modules/user/controllers/user.controller.js'
));

const seed = (() => {
  /**
   * Clear Assets
   * @async
   */
  const clearAssets = async () => {
    console.log(`clearAssets [${new Date().toString()}]`);

    const directory = path.resolve('./static/assets/images');

    fs.readdir(directory, (error, files) => {
      if (error) {
        throw error;
      }

      for (const file of files) {
        if (file === '.gitkeep') {
          continue;
        }

        fs.unlink(path.join(directory, file), (error) => {
          if (error) {
            throw error;
          }
        });
      }
    });
  };

  /**
   * Create roles
   * @async
   */
  const createRoles = async () => {
    console.log(`createRoles [${new Date().toString()}]`);

    const ctx = {
      request: {
        body: {},
      },
    };
    const roles = ['admin', 'user'];

    for (const role of roles) {
      ctx.request.body.role_name = role;

      await roleController.createRole(ctx);
    }
  };

  /**
   * Create users
   * @async
   */
  const createUsers = async () => {
    console.log(`createUsers [${new Date().toString()}]`);

    const ctx = {
      request: {
        body: {},
      },
    };
    const users = [
      {
        email: 'admin@localhost.com',
        firstName: 'Alpha',
        lastName: 'Beta',
        password: '!1A2b3C4d!',
        roles: '[1, 2]',
        username: 'admin',
      },
      {
        email: 'user@localhost.com',
        firstName: 'Gamma',
        lastName: 'Delta',
        password: '!1A2b3C4d!',
        roles: '[2]',
        username: 'user',
      },
    ];

    for (const user of users) {
      ctx.request.body = user;

      await userController.createUser(ctx);
    }
  };

  /**
   * Init
   * @async
   */
  const init = async () => {
    await clearAssets();
    await createRoles();
    await createUsers();
  };

  return {
    init: init,
  };
})();

seed.init().then(process.exit);
