import config from 'signal/config';
import knex from 'knex';
import log from 'signal/utils/log';

export default knex(config.knex)
  .on('query', ({sql}) => log.info(`SQL ${sql}`));
