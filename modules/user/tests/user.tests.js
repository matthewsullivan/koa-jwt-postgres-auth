const {test} = require('ava');

const path = require('path');
const server = require(path.resolve('./server.js'));

const request = require('supertest').agent(server.listen());

const user = {
  email: 'janedoe@localhost.com',
  firstName: 'Jane',
  lastName: 'Doe',
  password: '(a1B2c3D4e5F6g)',
};

test.serial('Registration should not allow weak password', async (t) => {
  const res = await request.post('/api/v1/register/').send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: 'abcdefg',
  });

  t.is(res.status, 400);
});

test.serial('Registration should not allow duplicate email', async (t) => {
  const res = await request.post('/api/v1/register/').send({
    email: 'johndoe@localhost.com',
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  });

  t.is(res.status, 400);
});

test.serial('Should register valid user', async (t) => {
  const res = await request.post('/api/v1/register/').send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  });

  t.is(res.status, 201);
});

test.serial('Should block secured route', async (t) => {
  const result = await request.get(`/api/v1/profile/${1}`);

  t.is(result.status, 401);
});

test.serial('Should login and allow access to secured route', async (t) => {
  const loginResult = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResult.body.data.attributes.access_token;

  const profileResult = await request
    .get(`/api/v1/profile/${1}`)
    .set('Authorization', `Bearer ${token}`);

  const email = profileResult.body.data.attributes.user.email;

  t.is(loginResult.status, 200);
  t.is(profileResult.status, 200);
  t.is(email, 'johndoe@localhost.com');
});
