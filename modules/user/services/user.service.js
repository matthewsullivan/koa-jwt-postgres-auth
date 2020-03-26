const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get User By Email
   * @param {string} email
   * @return {object}
   */
  getUserByEmail: (email) => {
    const statement = sql`
      SELECT id, email, first_name, last_name, created, updated 
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

  /**
   * Update Password
   * @param {object} user
   * @return {object}
   */
  updatePassword: (user) => {
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

  /**
   * Update profile
   * @param {object} user
   * @return {object}
   */
  updateProfile: (user) => {
    const statement = sql`
      UPDATE public.user
      SET 
        email = TRIM(${user.email.toLowerCase()}),
        first_name = TRIM(${user.firstName}),
        last_name = TRIM(${user.lastName}),
        updated = now()
      WHERE id = ${user.id}
      RETURNING id, email, first_name, last_name, created, updated;
    `;

    return pool.query(statement);
  },

  /**
   * Register User
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
