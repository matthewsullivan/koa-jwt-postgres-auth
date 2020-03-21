const {test} = require('ava');
const path = require('path');

const server = require(path.resolve('server.js'));

const request = require('supertest').agent(server.listen());

const admin = {
  password: '!1A2b3C4d!',
  username: 'admin',
};

const example1 = {
  id: 1,
  fields: {
    name: 'Alpha',
  },
  files: {
    '[object File]': {
      path: path.resolve('resources/images/image1.png'),
      type: 'image/jpeg',
    },
  },
};

const example2 = {
  fields: {
    name: 'Beta',
  },
  files: {
    '[object File]': {
      path: path.resolve('resources/images/image2.png'),
      type: 'image/jpeg',
    },
  },
};

test.serial('Login admin', async (t) => {
  const res = await request.post('/api/v1/login').send({
    password: admin.password,
    username: admin.username,
  });

  t.is(res.status, 200);
});

test.serial('Create example', async (t) => {
  const res = await request.post('/api/v1/examples').send({
    fields: example1.fields,
    files: example1.files,
  });

  t.is(res.status, 201);
});

test.serial('Should not create example with duplicated name', async (t) => {
  const res = await request.post('/api/v1/examples/').send({
    name: example1.fields.name.toUpperCase(),
  });

  t.is(res.status, 500);
});

test.serial('Get example by id', async (t) => {
  const res1 = await request.get('/api/v1/examples');

  const row = res1.body.rows[0];

  const res2 = await request.get(`/api/v1/examples/${row.id}`);

  t.is(res2.body.name, example1.fields.name);
  t.is(res2.status, 200);
});

test.serial('Get example by name', async (t) => {
  const res = await request.get(
    `/api/v1/examples/name/${example1.fields.name}`
  );

  t.is(res.status, 200);
});

test.serial('Get all examples', async (t) => {
  const res = await request.get('/api/v1/examples/');

  t.is(res.body.totalCount, 1);
  t.is(res.status, 200);
});

test.serial('Get examples paginated', async (t) => {
  const res = await request.get(
    '/api/v1/examples/?offset=0&limit=1&column=name&direction=ASC'
  );

  t.is(res.body.totalCount, 1);
  t.is(res.status, 200);
});

test.serial('Update example', async (t) => {
  const res1 = await request.get('/api/v1/examples');

  const row = res1.body.rows[0];

  const res = await request.put(`/api/v1/examples/${row.id}`).send({
    fields: example2.fields,
    files: example2.files,
  });

  t.is(res.status, 201);
});

test.serial('Delete example', async (t) => {
  const res1 = await request.get('/api/v1/examples');

  const row = res1.body.rows[0];

  const res = await request.del(`/api/v1/examples/${row.id}`);

  t.is(res.status, 200);
});

test.serial('Delete example with non-existing id', async (t) => {
  const res = await request.del('/api/v1/examples/1234567890');

  t.is(res.status, 204);
});

test.serial('Logout user', async (t) => {
  const res = await request.post('/api/v1/logout');

  t.is(res.status, 204);
});

test.serial('Get by id should not allow unauthenticated access', async (t) => {
  const res = await request.get(`/api/v1/examples/${example1.id}`);

  t.is(res.status, 401);
});

test.serial('Get all should not allow unauthenticated access', async (t) => {
  const res = await request.get('/api/v1/examples/');

  t.is(res.status, 401);
});

test.serial(
  'Get by example name should not allow unauthenticated access',
  async (t) => {
    const res = await request.get(
      `/api/v1/examples/name/${example1.fields.name}`
    );

    t.is(res.status, 401);
  }
);
