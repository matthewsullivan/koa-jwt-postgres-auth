const path = require('path');

const {_raw, sql} = require('pg-extra');

const {pool} = require(path.resolve('./config/lib/pg'));

module.exports = {
  /**
   * Create role
   * @param {object} role
   * @return {object}
   */
  createRole: (role) => {
    const statement = sql`
      INSERT INTO public.role (role_name)
      VALUES ( ${role.role_name} )
      RETURNING *;
    `;

    return pool.query(statement);
  },

  /**
   * Delete role
   * @param {number} roleId
   * @return {object}
   */
  deleteRole: (roleId) => {
    const statement = sql`
      DELETE FROM public.role
      WHERE id = ${roleId}
      RETURNING id;
    `;

    return pool.query(statement);
  },

  /**
   * Edit role
   * @param {object} role
   * @return {object}
   */
  editRole: (role) => {
    const statement = sql`
      UPDATE public.role
      SET 
        role_name = ${role.role_name},
        updated = now()
      WHERE id = ${role.id}
      RETURNING *;
    `;

    return pool.query(statement);
  },

  /**
   * Get role by id
   * @param {number} roleId
   * @return {object}
   */
  getRoleById: (roleId) => {
    const statement = sql`
      SELECT id, role_name, created, updated
      FROM public.role
      WHERE id = ${roleId};
    `;

    return pool.query(statement);
  },

  /**
   * Get role by role name
   * @param {string} roleName
   * @return {object}
   */
  getRoleByName: (roleName) => {
    const statement = sql`
      SELECT id, role_name, created, updated
      FROM public.role
      WHERE role_name = ${roleName};
    `;

    return pool.query(statement);
  },

  /**
   * Get roles
   * @param {string} [column = 'id']
   * @param {string} [direction = 'DESC']
   * @param {number} [limit = null]
   * @param {number} [offset = 0]
   * @return {object}
   */
  getRoles: (column = 'id', direction = 'DESC', limit = null, offset = 0) => {
    const statement = sql`
      SELECT id, role_name, created, updated 
      FROM public.role
    `.append(
      _raw`
        ORDER BY "${column}" ${direction} 
        LIMIT ${limit} 
        OFFSET ${offset} 
      `
    );

    return pool.query(statement);
  },

  /**
   * Get roles by user id
   * @param {number} userId
   * @return {object}
   */
  getRolesByUserId: (userId) => {
    const statement = sql`
      SELECT role_id, role_name
      FROM public.user u 
      INNER JOIN public.user_role ur ON u.id = user_id
      INNER JOIN public.role r ON ur.role_id = r.id
      WHERE u.id = ${userId};
    `;

    return pool.query(statement);
  },
};
