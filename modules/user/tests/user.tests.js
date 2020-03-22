const {test} = require('ava');

const path = require('path');

const server = require(path.resolve('./server.js'));

const request = require('supertest').agent(server.listen());

const admin = {
  id: 1,
  email: 'admin@localhost.com',
  password: '!1A2b3C4d!',
  username: 'admin',
};

const user = {
  id: 2,
  email: 'user@localhost.com',
  firstName: 'Gamma',
  lastName: 'Delta',
  username: 'user',
};

const dummy = {
  id: 3,
  email: 'dummy@localhost.com',
  firstName: 'Epsilon',
  lastName: 'Zeta',
  password: '!1A2b3C4d!',
  username: 'dummy',
};

test.serial('Login admin', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.status, 200);
});

test.serial('Get by id', async (t) => {
  let res = await request.get(
    '/api/v1/users?limit=5&offset=0&column=created&direction=desc&search={}'
  );

  const userId = res.body.rows[0].id;

  res = await request.get(`/api/v1/users/${userId}`);

  t.is(res.status, 200);
});

test.serial('Get all', async (t) => {
  const res = await request.get(
    '/api/v1/users?limit=5&offset=0&column=created&direction=desc&search={}'
  );

  t.is(res.status, 200);
  t.is(res.body.totalCount, 2);
});

test.serial('Create', async (t) => {
  const res = await request.post('/api/v1/users/').send({
    email: dummy.email,
    firstName: dummy.firstName,
    lastName: dummy.lastName,
    password: dummy.password,
    roles: dummy.roles,
    username: dummy.username,
  });

  t.is(res.status, 201);
});

test.serial('Create should not allow weak password', async (t) => {
  const password = '1234567890';

  const res = await request.post('/api/v1/users/').send({
    email: dummy.email,
    firstName: dummy.firstName,
    lastName: dummy.lastName,
    password: password,
    roles: dummy.roles,
    username: dummy.username,
  });

  t.is(res.status, 422);
});

test.serial('Create should not allow duplicate email', async (t) => {
  const res = await request.post('/api/v1/users/').send({
    email: user.email.toUpperCase(),
    firstName: dummy.firstName,
    lastName: dummy.lastName,
    password: dummy.password,
    roles: dummy.roles,
    username: dummy.username,
  });

  t.is(res.status, 500);
});

test.serial('Create should not allow duplicate username', async (t) => {
  const res = await request.post('/api/v1/users/').send({
    email: dummy.email,
    firstName: dummy.firstName,
    lastName: dummy.lastName,
    password: dummy.password,
    roles: dummy.roles,
    username: user.username,
  });

  t.is(res.status, 500);
});

test.serial('Check user by email', async (t) => {
  const res = await request.get(`/api/v1/users/email/${admin.email}`);

  t.is(res.status, 200);
  t.is(res.body.email, admin.email);
});

test.serial('Check user by username', async (t) => {
  const res = await request.get(`/api/v1/users/username/${admin.username}`);

  t.is(res.status, 200);
  t.is(res.body.username, admin.username);
});

test.serial('Login user', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: dummy.password,
    username: dummy.username,
  });

  t.is(res.status, 200);
});

test.serial('Get by id should not allow unauthorized access', async (t) => {
  const res = await request.get(`/api/v1/users/${admin.id}`);

  t.is(res.status, 401);
});


test.serial('Login admin', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.status, 200);
});


test.serial('Logout user', async (t) => {
  const res = await request.post('/api/v1/logout');

  t.is(res.status, 204);
});

test.serial('Get by id should not allow unauthenticated access', async (t) => {
  const res = await request.get(`/api/v1/users/${admin.id}`);

  t.is(res.status, 401);
});
