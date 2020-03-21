const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

const exampleService = require(path.resolve(
  './modules/example/services/example.service.js'
));

module.exports = {
  /**
   * Create example
   * @async
   * @param {object} ctx
   */
  createExample: async (ctx) => {
    const example = ctx.request.body;
    const fields = example.fields;
    const files = example.files['[object File]'];
    const mimeType = files.type.split('/');
    const types = ['gif', 'jpeg', 'png', 'svg+xml'];

    if (!types.includes(mimeType[1])) {
      return;
    }

    const shortId = shortid.generate();

    const filename = `${shortId}.${mimeType[1]}`;

    const reader = fs.createReadStream(files.path);
    const stream = fs.createWriteStream(
      path.resolve(`./static/assets/images/${filename}`)
    );

    reader.pipe(stream);

    const result = await exampleService.createExample(fields.name, filename);

    if (result.rowCount) {
      ctx.status = 201;
    }
  },

  /**
   * Delete example
   * @async
   * @param {object} ctx
   */
  deleteExample: async (ctx) => {
    const exampleId = ctx.params.id;
    const resultA = await exampleService.getExampleById(exampleId);

    if (resultA.rowCount) {
      fs.unlinkSync(
        path.resolve(`./static/assets/images/${resultA.rows[0].image}`)
      );
    }

    const resultB = await exampleService.deleteExample(exampleId);

    ctx.body = resultB.rows;

    if (!resultB.rowCount) {
      ctx.status = 204;
    }
  },

  /**
   * Edit example
   * @async
   * @param {object} ctx
   */
  editExample: async (ctx) => {
    const body = ctx.request.body;
    const exampleId = ctx.params.id;
    const fields = body.fields;
    const files = body.files['[object File]'];

    let resultB;

    if (files) {
      const mimeType = files.type.split('/');
      const types = ['gif', 'jpeg', 'png', 'svg+xml'];

      const resultA = await exampleService.getExampleById(exampleId);

      if (resultA) {
        fs.unlinkSync(
          path.resolve(`./static/assets/images/${resultA.rows[0].image}`)
        );
      }

      if (types.includes(mimeType[1])) {
        const shortId = shortid.generate();

        const filename = `${shortId}.${mimeType[1]}`;

        const reader = fs.createReadStream(files.path);
        const stream = fs.createWriteStream(
          path.resolve(`./static/assets/images/${filename}`)
        );

        reader.pipe(stream);

        resultB = await exampleService.editExample(
          exampleId,
          fields.name,
          filename
        );
      }
    } else {
      resultB = await exampleService.editExample(exampleId, fields.name, null);
    }

    if (resultB.rowCount) {
      ctx.status = 201;
    }
  },

  /**
   * Get example
   * @async
   * @param {object} ctx
   */
  getExample: async (ctx) => {
    const exampleId = ctx.params.id;
    const result = await exampleService.getExampleById(exampleId);

    const example = result.rows[0];

    ctx.body = example;
  },

  /**
   * Get example by name
   * @async
   * @param {object} ctx
   */
  getExampleByName: async (ctx) => {
    const name = ctx.params.name;
    const result = await exampleService.getExampleByName(name);

    const example = result.rows[0];

    ctx.body = example;
  },

  /**
   * Get examples
   * @async
   * @param {object} ctx
   */
  getExamples: async (ctx) => {
    const resultA = await exampleService.getExamples();
    const resultB = await exampleService.getExamples(
      ctx.request.query.column,
      ctx.request.query.direction,
      ctx.request.query.limit,
      ctx.request.query.offset
    );

    ctx.body = {
      rows: resultB.rows,
      totalCount: resultA.rowCount,
    };
  },
};
