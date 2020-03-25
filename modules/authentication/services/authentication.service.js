const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get User By Email
   * @param {string} email
   * @return {object}
   */
  getUserByEmail: (email) => {
    const statement = sql`
      SELECT id, email, first_name, last_name, password, created
      FROM public.user
      WHERE email = ${email};
    `;

    return pool.query(statement);
  },

  /**
   * Get User By Id
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
};
