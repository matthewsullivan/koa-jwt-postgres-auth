const {test} = require('ava');
const path = require('path');

const server = require(path.resolve('./server.js'));

const request = require('supertest').agent(server.listen());

const admin = {
  password: '!1A2b3C4d!',
  username: 'admin',
};

test.serial('Should login successfully', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.body.roles[0], 'admin');
  t.is(res.status, 200);
});

test.serial('Should logout successfully', async (t) => {
  const res = await request.post('/api/v1/logout');

  t.is(res.status, 204);
});
