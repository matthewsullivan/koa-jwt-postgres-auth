const argon2 = require('argon2');
const passport = require('koa-passport');
const path = require('path');

const LocalStrategy = require('passport-local').Strategy;

const authService = require(path.resolve(
  './modules/authentication/services/authentication.service.js'
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
  const result = await userService.getUserById(userId);
  const user = result.rows[0];

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

  const verified = await argon2.verify(
    result.rows[0].password,
    credentials.password
  );

  return verified ? await getUserById(result.rows[0].id) : false;
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

    const user = await validate(credentials);

    return user ? done(null, user) : done('invalid', false);
  })
);
