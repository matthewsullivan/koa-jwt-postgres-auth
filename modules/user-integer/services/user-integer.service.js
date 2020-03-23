const path = require('path');

const {pool} = require(path.resolve('./config/lib/pg'));
const {sql} = require('pg-extra');

module.exports = {
  /**
   * Get current
   * @param {number} userId
   * @return {object}
   */
  getCurrent: (userId) => {
    const statement = sql`
      SELECT id, user_id, integer, created, updated
      FROM public.user_integer
      WHERE user_id = ${userId};
    `;

    return pool.query(statement);
  },

  /**
   * Upsert current
   * @param {number} userId
   * @param {number} current
   * @return {object}
   */
  upsertCurrent: (userId, current) => {
    const statement = sql`
      INSERT INTO public.user_integer (user_id, integer)
      VALUES (${userId}, ${current})
      ON CONFLICT (user_id) DO UPDATE
      SET
        integer = ${current},
        updated = now()
      RETURNING id, user_id, integer, created, updated;
    `;

    return pool.query(statement);
  },

  /**
   * Upsert next
   * @param {number} id
   * @return {object}
   */
  upsertNext: (id) => {
    const statement = sql`
      INSERT INTO public.user_integer (user_id, integer)
      VALUES (${id}, 1)
      ON CONFLICT (user_id) DO UPDATE
      SET 
        integer = COALESCE(user_integer.integer + 1),
        updated = now()
      RETURNING id, user_id, integer, created, updated;
    `;

    return pool.query(statement);
  },
};
