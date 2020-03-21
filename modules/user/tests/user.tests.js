const {test} = require('ava');
const addMilliseconds = require('date-fns/addMilliseconds');
const format = require('date-fns/format');
const subSeconds = require('date-fns/subSeconds');
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
  roles: '[2]',
  username: 'user',
};

const dummy = {
  id: 3,
  email: 'dummy@localhost.com',
  firstName: 'Epsilon',
  lastName: 'Zeta',
  password: '!1A2b3C4d!',
  roles: '[2]',
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

test.serial('Search term only', async (t) => {
  const search = JSON.stringify({
    term: 'user',
  });

  const res = await request.get(
    `/api/v1/users?limit=5&offset=0&column=created&direction=desc&search=${search}`
  );

  t.is(res.status, 200);
  t.is(res.body.rows.length, 1);
  t.is(res.body.rows[0].username, user.username);
});

test.serial('Search start date only', async (t) => {
  const date = format(subSeconds(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSS");

  const search = JSON.stringify({
    startDate: date,
  });

  const res = await request.get(
    `/api/v1/users/?limit=5&offset=0&column=created&direction=desc&search=${search}`
  );

  t.is(res.status, 200);
  t.is(res.body.totalCount, 1);
});

test.serial('Search end date only', async (t) => {
  let endDate;

  const users = await request.get(
    '/api/v1/users?limit=5&offset=0&column=created&direction=asc&search={}'
  );

  if (users.body.rows.length) {
    const firstUserCreated = users.body.rows[0].created;
    endDate = format(
      addMilliseconds(new Date(firstUserCreated), 1),
      "yyyy-MM-dd'T'HH:mm:ss.SSS"
    );
  }

  const search = JSON.stringify({
    endDate: endDate,
  });

  const res = await request.get(
    `/api/v1/users/?limit=5&offset=0&column=created&direction=desc&search=${search}`
  );

  t.is(res.status, 200);
  t.is(res.body.totalCount, 1);
});

test.serial('Update', async (t) => {
  let res = await request.get(
    '/api/v1/users?limit=5&offset=0&column=created&direction=desc&search={}'
  );

  const userId = res.body.rows[0].id;

  res = await request.post(`/api/v1/users/profile/${userId}`).send({
    email: dummy.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    username: dummy.username,
  });

  t.is(res.status, 200);
  t.is(parseInt(res.body.id), userId);
});

test.serial('Update password', async (t) => {
  const res = await request.post(`/api/v1/users/password/${user.id}`).send({
    password: dummy.password,
  });

  t.is(res.status, 204);
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

test.serial('Update should not allow unauthorized access', async (t) => {
  const res = await request.post(`/api/v1/users/profile/${admin.id}`).send({
    email: dummy.email,
    firstName: dummy.firstName,
    lastName: dummy.lastName,
    roles: user.roles,
    username: dummy.username,
  });

  t.is(res.status, 401);
});

test.serial(
  'Update password should not allow unauthorized access',
  async (t) => {
    const res = await request.post(`/api/v1/users/password/${admin.id}`).send({
      password: dummy.password,
    });

    t.is(res.status, 401);
  }
);

test.serial('Login admin', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.status, 200);
});

test.serial('Delete', async (t) => {
  let res = await request.get(
    '/api/v1/users?limit=5&offset=0&column=id&direction=desc&search={}'
  );

  const userId = res.body.rows[0].id;

  res = await request.del(`/api/v1/users/${userId}`);

  t.is(res.status, 200);
  t.is(res.body[0].id, userId);
});

test.serial('Delete id not found', async (t) => {
  const res = await request.del(`/api/v1/users/${dummy.id}`);

  t.is(res.status, 204);
});

test.serial('Logout user', async (t) => {
  const res = await request.post('/api/v1/logout');

  t.is(res.status, 204);
});

test.serial('Get by id should not allow unauthenticated access', async (t) => {
  const res = await request.get(`/api/v1/users/${admin.id}`);

  t.is(res.status, 401);
});
