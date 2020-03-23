const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get user by id
   * @param {number} userId
   * @return {object}
   */
  getUserById: (userId) => {
    const statement = sql`
      SELECT id, email, first_name, last_name, created 
      FROM public.user
      WHERE id = ${userId};
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
      INSERT INTO public.user (email, password, first_name, last_name)
      VALUES (
        TRIM(${user.email.toLowerCase()}),
        TRIM(${user.password}),
        TRIM(${user.firstName}),
        TRIM(${user.lastName})
      )
      RETURNING id, email, first_name, last_name, created;
    `;

    return pool.query(statement);
  },
};
