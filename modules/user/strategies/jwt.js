const passport = require('koa-passport');
const path = require('path');

const config = require(path.resolve('./config/env/default'));

const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTstrategy = require('passport-jwt').Strategy;

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
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
  new JWTstrategy(options, (token, done) => {
    return done(null, token);
  })
);
