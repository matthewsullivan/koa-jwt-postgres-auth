const {test} = require('ava');

const path = require('path');
const server = require(path.resolve('./server.js'));

const request = require('supertest').agent(server.listen());

const user = {
  email: 'johndoe@localhost.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '(a1B2c3D4e5F6g)',
};

test.serial('Should block secured routes', async (t) => {
  const currentResponse = await request.put(`/api/v1/current`);
  const nextResponse = await request.get(`/api/v1/next`);

  t.is(currentResponse.status, 401);
  t.is(nextResponse.status, 401);
});

test.serial('Should login and allow access to secured routes', async (t) => {
  const loginResponse = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.attributes.access_token;

  const currentResponse = await request
    .put(`/api/v1/current/`)
    .set('Authorization', `Bearer ${token}`);

  const nextResponse = await request
    .get(`/api/v1/next/`)
    .set('Authorization', `Bearer ${token}`);

  t.is(loginResponse.status, 200);
  t.is(currentResponse.status, 200);
  t.is(nextResponse.status, 200);
});

test.serial("Should increment user's integer", async (t) => {
  const loginResponse = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.attributes.access_token;

  const currentResponse = await request
    .put(`/api/v1/current/`)
    .set('Authorization', `Bearer ${token}`);

  const currentIndex = currentResponse.body.data.attributes.current;

  const nextResponse = await request
    .get(`/api/v1/next/`)
    .set('Authorization', `Bearer ${token}`);

  const nextIndex = nextResponse.body.data.attributes.next;

  t.is(loginResponse.status, 200);
  t.truthy(nextIndex === currentIndex + 1);
});

test.serial('Should PUT user defined current integer', async (t) => {
  const loginResponse = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.attributes.access_token;

  const currentResponse = await request
    .put(`/api/v1/current/`)
    .send({current: 100})
    .set('Authorization', `Bearer ${token}`);

  const responseIndex = currentResponse.body.data.attributes.current;

  t.is(loginResponse.status, 200);
  t.truthy(responseIndex === 100);
});

test.serial('Should not PUT negative integer', async (t) => {
  const loginResponse = await request.post('/api/v1/login').send({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.attributes.access_token;

  const currentResponse = await request
    .put(`/api/v1/current/`)
    .send({current: -100})
    .set('Authorization', `Bearer ${token}`);

  t.is(loginResponse.status, 200);
  t.is(currentResponse.status, 400);
});
