const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get current
   * @param {number} id
   * @param {number} current
   * @return {object}
   */
  getCurrent: (id, current) => {
    const statement = sql`
      INSERT INTO public.user_integer (user_id, integer)
      VALUES (${id}, ${1})
      ON CONFLICT (user_id) DO UPDATE
      SET 
        integer = ${current},
        updated = now()
      RETURNING id, user_id, integer, created, updated;
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
