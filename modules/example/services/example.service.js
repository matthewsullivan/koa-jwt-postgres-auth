const path = require('path');
const {_raw, sql} = require('pg-extra');

const {pool} = require(path.resolve('./config/lib/pg'));

module.exports = {
  /**
   * Create example
   * @param {string} name
   * @param {string} image
   * @return {object}
   */
  createExample: (name, image) => {
    const statement = sql`
      INSERT INTO public.example (name, image)
      VALUES (${name}, ${image})
      RETURNING id, name, image, created, updated;
    `;

    return pool.query(statement);
  },

  /**
   * Delete example
   * @param {number} exampleId
   * @return {array}
   */
  deleteExample: (exampleId) => {
    const statement = sql`
      DELETE FROM public.example
      WHERE id = ${exampleId}
      RETURNING id;
    `;

    return pool.query(statement);
  },

  /**
   * Edit example
   * @param {number} id
   * @param {string} name
   * @param {string|null} image
   * @return {object}
   */
  editExample: (id, name, image = null) => {
    const statement = sql`
      UPDATE public.example
      SET 
      name = ${name},
    `
      .append(
        (() => {
          if (image) {
            return sql`
              image = ${image},
            `;
          }
        })()
      )
      .append(
        sql`
          updated = now()
          WHERE id = ${id}
          RETURNING id, name, image, created, updated;
        `
      );

    return pool.query(statement);
  },

  /**
   * Get example by id
   * @param {number} exampleId
   * @return {object}
   */
  getExampleById: (exampleId) => {
    const statement = sql`
      SELECT id, name, image, created, updated
      FROM public.example
      WHERE id = ${exampleId};
    `;

    return pool.query(statement);
  },

  /**
   * Get example by name
   * @param {string} name
   * @return {object}
   */
  getExampleByName: (name) => {
    const statement = sql`
      SELECT id, name, image, created, updated
      FROM public.example
      WHERE name = ${name};
    `;

    return pool.query(statement);
  },

  /**
   * Get examples
   * @param {string} [column = 'id']
   * @param {string} [direction = 'DESC']
   * @param {number} [limit = none]
   * @param {number} [offset = 0]
   * @return {object}
   */
  getExamples: (
    column = 'id',
    direction = 'DESC',
    limit = null,
    offset = 0
  ) => {
    const statement = sql`
      SELECT id, name, image, created, updated
      FROM public.example
    `.append(
      _raw`
        ORDER BY "${column}" ${direction} 
        LIMIT ${limit} 
        OFFSET ${offset} 
      `
    );

    return pool.query(statement);
  },
};
