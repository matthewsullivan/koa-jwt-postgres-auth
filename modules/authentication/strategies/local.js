const argon2 = require('argon2');
const passport = require('koa-passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;

const authService = require(path.resolve(
  './modules/authentication/services/authentication.service.js'
));
const roleService = require(path.resolve(
  './modules/role/services/role.service.js'
));
const userService = require(path.resolve(
  './modules/user/services/user.service.js'
));

/**
 * Get user by id
 * @async
 * @param {number} userId
 * @return {object}
 */
const getUserById = async (userId) => {
  const roles = [];

  const resultA = await userService.getUserById(userId);
  const resultB = await roleService.getRolesByUserId(userId);

  const user = resultA.rows[0];

  resultB.rows.forEach((row) => {
    roles.push(row.role_name);
  });

  if (user) {
    user.roles = roles;
  }

  return user;
};

/**
 * Validate
 * @async
 * @param {object} credentials
 * @return {boolean|object}
 */
const validate = async (credentials) => {
  const result = await authService.getUserByUsername(credentials.username);

  if (!result.rowCount) {
    return false;
  }

  const verify = await argon2.verify(
    result.rows[0].password,
    credentials.password
  );

  return verify === true ? await getUserById(result.rows[0].id) : false;
};

/**
 * Use
 * @callback done
 * @param {string} username
 * @param {string} password
 * @param {function} done
 * @return {object}
 */
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const credentials = {
      password: password,
      username: username,
    };

    const result = await validate(credentials);

    return result ? done(null, result) : done('invalid', false);
  })
);
