const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Create user role
   * @param {object} user
   * @param {object} roleId
   * @return {object}
   */
  createUserRole: (user, roleId) => {
    const statement = sql`
      INSERT INTO public.user_role (user_id, role_id)
      SELECT ${user.id}, ${roleId}
      RETURNING *;
    `;

    return pool.query(statement);
  },

  /**
   * Delete user roles
   * @param {number} userId
   * @return {object}
   */
  deleteUserRoles: (userId) => {
    const statement = sql`
      DELETE FROM public.user_role 
      WHERE user_id = ${userId};
    `;

    return pool.query(statement);
  },
};
