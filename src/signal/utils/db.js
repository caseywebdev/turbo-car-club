import config from '../config';
import knex from 'knex';
import log from './log';

export default knex(config.knex)
  .on('query', ({sql}) => log.info(`SQL ${sql}`));
