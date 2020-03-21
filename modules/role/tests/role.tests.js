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

const roleAdmin = {
  id: 1,
  role_name: 'admin',
};

const roleUser = {
  id: 2,
  role_name: 'user',
};

const roleNew = {
  role_name: 'guest',
};

test.serial('Login', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.status, 200);
});

test.serial('Create', async (t) => {
  const res = await request.post('/api/v1/roles/').send({
    role_name: roleNew.role_name,
  });

  t.is(res.status, 201);
});

test.serial('Create should not allow duplicate role_name', async (t) => {
  const res = await request.post('/api/v1/roles/').send({
    role_name: roleNew.role_name,
  });

  t.is(res.status, 500);
});

test.serial('Get by id', async (t) => {
  const res = await request.get(`/api/v1/roles/${roleAdmin.id}`);

  t.is(res.status, 200);
  t.is(res.body[0].role_name, roleAdmin.role_name);
});

test.serial('Get all', async (t) => {
  const res = await request.get('/api/v1/roles/');

  t.is(res.status, 200);
  t.is(res.body.results[0].role_name, roleNew.role_name);
  t.is(res.body.results[1].role_name, roleUser.role_name);
  t.is(res.body.results[2].role_name, roleAdmin.role_name);
});

test.serial('Get paginated', async (t) => {
  const res = await request.get(
    '/api/v1/roles/?offset=0&limit=5&column=role_name&direction=ASC'
  );

  t.is(res.status, 200);
  t.is(res.body.results[0].role_name, roleAdmin.role_name);
  t.is(res.body.results[1].role_name, roleNew.role_name);
  t.is(res.body.results[2].role_name, roleUser.role_name);
});

test.serial('Update', async (t) => {
  let res = await request.get(
    '/api/v1/roles/?offset=0&limit=5&column=id&direction=DESC'
  );

  const role = res.body.results[0];

  res = await request.post(`/api/v1/roles/${role.id}`).send({
    role_name: 'super',
  });

  t.is(res.status, 200);
  t.is(res.body[0].id, role.id);
});

test.serial('Update should not allow duplicate role_name', async (t) => {
  let res = await request.get(
    '/api/v1/roles/?offset=0&limit=5&column=id&direction=DESC'
  );

  const role = res.body.results[0];

  res = await request.post(`/api/v1/roles/${role.id}`).send({
    role_name: roleAdmin.role_name,
  });

  t.is(res.status, 500);
});

test.serial('Delete', async (t) => {
  let res = await request.get(
    '/api/v1/roles/?offset=0&limit=5&column=id&direction=DESC'
  );

  const role = res.body.results[0];

  res = await request.del(`/api/v1/roles/${role.id}`);

  t.is(res.status, 200);
  t.is(res.body[0].id, role.id);
});

test.serial('Delete id not found', async (t) => {
  let res = await request.get(
    '/api/v1/roles/?offset=0&limit=5&column=id&direction=DESC'
  );

  const role = res.body.results[0];

  res = await request.del(`/api/v1/roles/${role.id}`);

  t.is(res.status, 500);
});
