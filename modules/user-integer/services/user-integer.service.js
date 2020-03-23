const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get current
   * @param {number} userId
   * @param {number} current
   * @return {object}
   */
  getCurrent: (userId, current) => {
    if (current) {
      const statement = sql`
        UPDATE public.user_integer
        SET 
          integer = ${current},
          updated = now()
        WHERE user_id = ${userId}
        RETURNING id, user_id, integer, created, updated;
      `;

      return pool.query(statement);
    }

    const statement = sql`
      SELECT id, user_id, integer, created, updated
      FROM public.user_integer
      WHERE user_id = ${userId};
    `;

    return pool.query(statement);
  },

  /**
   * Get next
   * @param {number} id
   * @return {object}
   */
  getNext: (id) => {
    const statement = sql`
      UPDATE public.user_integer
      SET 
        integer = integer + 1,
        updated = now()
      WHERE user_id = ${id}
      RETURNING id, user_id, integer, created, updated;
    `;

    return pool.query(statement);
  },
};
