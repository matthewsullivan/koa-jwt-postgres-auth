const Koa = require('koa');

const app = new Koa();

const body = require('koa-body');
const glob = require('glob');
const passport = require('koa-passport');
const path = require('path');

const config = require(path.resolve('./config/env/default'));

app.use(body()).use(passport.initialize());

glob.sync('./modules/*/routes/*.js').forEach((file) => {
  const routes = require(path.resolve(file)).routes();

  app.use(routes);
});

app.keys = ['simple-api'];
app.proxy = true;

app.listen(config.server.port);

console.log('\nSimple API\n');
console.log(`Environment: \t ${process.env.NODE_ENV}`);
console.log(`Port: \t\t ${config.server.port}`);
console.log(`\n${new Date().toString()}\n`);
