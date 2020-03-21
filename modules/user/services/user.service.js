const path = require('path');

const {_raw, sql} = require('pg-extra');

const {pool} = require(path.resolve('./config/lib/pg'));

/**
 * Build query
 * @param {object} search
 * @return {string|undefined}
 */
const buildQuery = (search) => {
  const queries = [];

  if (search.term) {
    const parsedTerms = parseTerm(search.term);

    queries.push(`
      AND (
        to_tsvector(email) @@ to_tsquery('${parsedTerms}') 
        OR to_tsvector(first_name) @@ to_tsquery('${parsedTerms}')
        OR to_tsvector(last_name) @@ to_tsquery('${parsedTerms}') 
        OR to_tsvector(username) @@ to_tsquery('${parsedTerms}')
      )
    `);
  }

  if (search.startDate) {
    queries.push(`AND created > '${search.startDate}'`);
  }

  if (search.endDate) {
    queries.push(`AND created < '${search.endDate}'`);
  }

  return queries.join(' ');
};

/**
 * Parse term
 * @param {string} term
 * @return {string}
 */
const parseTerm = (term) => {
  const parts = [];

  let terms = term.trim().split(' ');

  terms = terms.filter((term) => {
    return term !== '';
  });

  terms.map((term, index) => {
    if (/[&|!()]{2,}/.test(term)) {
      term = term.charAt(0);
    }

    if (
      index > 0 &&
      !/[&|!()]/.test(term) &&
      !/[&|!()]/.test(terms[index - 1])
    ) {
      parts.push(index);
    }
  });

  parts.reverse().map((part) => terms.splice(part, 0, '|'));

  const parsed = terms.join(' ');

  return parsed;
};

module.exports = {
  /**
   * Create user
   * @param {object} user
   * @return {object}
   */
  createUser: (user) => {
    const statement = sql`
      INSERT INTO public.user (username, email, password, first_name, last_name)
      VALUES (
        TRIM(${user.username}),
        TRIM(${user.email.toLowerCase()}),
        TRIM(${user.password}),
        TRIM(${user.firstName}),
        TRIM(${user.lastName})
      )
      RETURNING id, username, email, first_name, last_name, created, updated;
    `;

    return pool.query(statement);
  },

  /**
   * Delete user
   * @param {number} userId
   * @return {object}
   */
  deleteUser: (userId) => {
    const statement = sql`
      DELETE FROM public.user
      WHERE id = ${userId}
      RETURNING id;
    `;

    return pool.query(statement);
  },

  /**
   * Edit user
   * @param {object} user
   * @return {object}
   */
  editUser: (user) => {
    const statement = sql`
      UPDATE public.user
      SET 
        email = TRIM(${user.email.toLowerCase()}),
        username = TRIM(${user.username}),
        first_name = TRIM(${user.firstName}),
        last_name = TRIM(${user.lastName}),
        updated = now()
      WHERE id = ${user.id}
      RETURNING id, username, email, first_name, last_name, created, updated;
    `;

    return pool.query(statement);
  },

  /**
   * Get user by email
   * @param {string} email
   * @return {object}
   */
  getUserByEmail: (email) => {
    const statement = sql`
      SELECT id, username, email, first_name, last_name, created, updated 
      FROM public.user
      WHERE email = ${email};
    `;

    return pool.query(statement);
  },

  /**
   * Get user by id
   * @param {number} userId
   * @return {object}
   */
  getUserById: (userId) => {
    const statement = sql`
      SELECT id, username, email, first_name, last_name, created, updated 
      FROM public.user
      WHERE id = ${userId};
    `;

    return pool.query(statement);
  },

  /**
   * Get user by username
   * @param {string} username
   * @return {object}
   */
  getUserByUsername: (username) => {
    const statement = sql`
      SELECT id, username, email, first_name, last_name, created, updated 
      FROM public.user
      WHERE username = ${username};
    `;

    return pool.query(statement);
  },

  /**
   * Get users
   * @param {object} search
   * @param {string} [column = 'id']
   * @param {string} [direction = 'DESC']
   * @param {number} [limit = null]
   * @param {number} [offset = 0]
   * @return {object}
   */
  getUsers: (
    search = {},
    column = 'id',
    direction = 'DESC',
    limit = null,
    offset = 0
  ) => {
    const query = buildQuery(search);

    const statement = sql`
      SELECT id, username, email, first_name, last_name, created, updated 
      FROM public.user T1
    `
      .append(
        _raw`
          WHERE TRUE ${query}
        `
      )
      .append(
        _raw`
          ORDER BY ${column} ${direction}
          LIMIT ${limit}
          OFFSET ${offset}
        `
      );

    return pool.query(statement);
  },

  /**
   * Update user password
   * @param {object} user
   * @return {object}
   */
  updateUserPassword: (user) => {
    const statement = sql`
      UPDATE public.user
      SET 
        password = ${user.password},
        updated = now()
      WHERE id = ${user.id}
      RETURNING id;
    `;

    return pool.query(statement);
  },
};
