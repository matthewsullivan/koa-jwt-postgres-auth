const fs = require('fs');
const glob = require('glob');
const http = require('http');
const https = require('https');
const Koa = require('koa');
const body = require('koa-body');
const convert = require('koa-convert');
const passport = require('koa-passport');
const session = require('koa-session');
const sslify = require('koa-sslify');
const serve = require('koa-static');
const cors = require('kcors');
const path = require('path');

const config = require(path.resolve('./config/env/default'));
const scheduler = require(path.resolve('./scheduler.js'));

const app = new Koa();

const whitelist = process.env.URL_ORIGIN
  ? process.env.URL_ORIGIN.split(' ').join(' || ')
  : 'http://127.0.0.1:8081 https://localhost.example.com';

let pemPath;
let secure;
let tlsOptions;

/**
 * Check origin
 * @param {object} ctx
 * @return {object}
 */
function checkOrigin(ctx) {
  const origin = ctx.accept.headers.origin;

  if (!whitelist.includes(origin)) {
    return ctx.throw(`${origin} is not a valid origin`);
  }

  return origin;
}

switch (process.env.NODE_ENV) {
  case 'production':
    pemPath = '/etc/letsencrypt/live/api.simple.example.com';
    secure = true;
    break;
  case 'staging':
    pemPath = '/etc/letsencrypt/live/api.simple-staging.example.com';
    secure = true;
    break;
  case 'local':
    pemPath = './resources/certificates/live/localhost.example.com';
    secure = true;
    break;
  default:
    secure = false;
    break;
}

const bodyOptions = {
  multipart: true,
};
const corsOptions = {
  credentials: true,
  origin: checkOrigin,
};

if (secure) {
  tlsOptions = {
    cert: fs.readFileSync(`${pemPath}/fullchain.pem`),
    key: fs.readFileSync(`${pemPath}/privkey.pem`),
  };
}

app
  .use(body(bodyOptions))
  .use(convert(cors(corsOptions)))
  .use(session(config.session, app))
  .use(passport.initialize())
  .use(passport.session())
  .use(serve(path.resolve('./static'), {hidden: true}));

glob.sync('./modules/*/routes/*.js').forEach(function(file) {
  app.use(require(path.resolve(file)).routes());
});

app.keys = ['simple-back-end'];
app.proxy = true;

if (!module.parent) {
  http.createServer(app.callback()).listen(config.server.port);

  if (Number(config.server.port) === 80 && secure) {
    app.use(sslify());
    https.createServer(tlsOptions, app.callback()).listen(443);
  }
}

if (process.env.SIMPLE_SCHEDULER === 'true') {
  scheduler.initialize();
}

console.log('\nSimple Back-end\n');
console.log(`Environment: \t ${process.env.NODE_ENV}`);
console.log(`Port: \t\t ${config.server.port}`);
console.log(`Origin(s): \t ${whitelist}`);
console.log(`\n${new Date().toString()}\n`);

module.exports = app;
