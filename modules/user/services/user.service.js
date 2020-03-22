const path = require('path');

const {sql} = require('pg-extra');

const {pool} = require(path.resolve('./config/lib/pg'));

module.exports = {
  /**
   * Get user by email
   * @param {string} email
   * @return {object}
   */
  getUserByEmail: (email) => {
    const statement = sql`
      SELECT id, username, email, first_name, last_name, created 
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
      SELECT id, username, email, first_name, last_name, created 
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
      SELECT id, username, email, first_name, last_name, created 
      FROM public.user
      WHERE username = ${username};
    `;

    return pool.query(statement);
  },

  /**
   * Register user
   * @param {object} user
   * @return {object}
   */
  registerUser: (user) => {
    const statement = sql`
      INSERT INTO public.user (username, email, password, first_name, last_name)
      VALUES (
        TRIM(${user.username}),
        TRIM(${user.email.toLowerCase()}),
        TRIM(${user.password}),
        TRIM(${user.firstName}),
        TRIM(${user.lastName})
      )
      RETURNING id, username, email, first_name, last_name, created;
    `;

    return pool.query(statement);
  },
};
