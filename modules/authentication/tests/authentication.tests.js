const path = require('path');
const test = require('ava');

const app = require(path.resolve('./app.js'));
const request = require('supertest').agent(app.listen());

const user = {
  email: 'johndoe@localhost.com',
  password: '(a1B2c3D4e5F6g)',
};

test.serial('Should login seed user', async (t) => {
  const response = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  t.is(response.status, 200);
});
