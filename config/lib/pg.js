const path = require('path');
const {extend} = require('pg-extra');

const config = require(path.resolve('./config/env/default'));

const pg = extend(require('pg'));
const pool = new pg.Pool(config.db);

module.exports = {pool};
