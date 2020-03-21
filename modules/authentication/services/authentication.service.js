const path = require('path');
const {sql} = require('pg-extra');

const {pool} = require(path.resolve('./config/lib/pg'));

module.exports = {
  /**
   * Get user by username
   * @param {string} username
   * @return {object}
   */
  getUserByUsername: (username) => {
    const statement = sql`
      SELECT id, username, email, first_name, last_name, password, created, updated
      FROM public.user
      WHERE username = ${username};
    `;

    return pool.query(statement);
  },
};
