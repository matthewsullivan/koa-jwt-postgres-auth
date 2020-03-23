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

test.serial('Registration should not allow invalid email', async (t) => {
  const response = await request.post('/api/v1/register/').send({
    email: 'jane',
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  });

  t.is(response.status, 400);
});

test.serial('Registration should not allow weak password', async (t) => {
  const response = await request.post('/api/v1/register/').send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: 'abcdefg',
  });

  t.is(response.status, 400);
});

test.serial('Registration should not allow duplicate email', async (t) => {
  const response = await request.post('/api/v1/register/').send({
    email: 'johndoe@localhost.com',
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  });

  t.is(response.status, 400);
});

test.serial('Should register valid user', async (t) => {
  const response = await request.post('/api/v1/register/').send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  });

  t.is(response.status, 201);
});

test.serial('Should block secured route', async (t) => {
  const response = await request.get('/api/v1/profile/1');

  t.is(response.status, 401);
});

test.serial('Should login and allow access to secured route', async (t) => {
  const loginResponse = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.attributes.access_token;

  const profileResponse = await request
    .get('/api/v1/profile/1')
    .set('Authorization', `Bearer ${token}`);

  const email = profileResponse.body.data.attributes.user.email;

  t.is(loginResponse.status, 200);
  t.is(profileResponse.status, 200);
  t.is(email, 'johndoe@localhost.com');
});
