import {resolve} from 'path';
import {extend} from 'pg-extra';

const config = require(resolve('./config/env/default'));

const pg = extend(require('pg'));
const pool = new pg.Pool(config.db);

export default {pool};
