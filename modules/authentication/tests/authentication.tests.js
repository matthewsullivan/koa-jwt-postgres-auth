const {test} = require('ava');

const path = require('path');
const server = require(path.resolve('./server.js'));

const request = require('supertest').agent(server.listen());

const user = {
  password: '!1A2b3C4d!',
  username: 'johndoe',
};

test.serial('Should login seed user', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: user.password,
    username: user.username,
  });

  t.is(res.status, 200);
});
