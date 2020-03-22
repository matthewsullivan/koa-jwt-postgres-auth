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
      SELECT id, username, email, first_name, last_name, password, created
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
};
