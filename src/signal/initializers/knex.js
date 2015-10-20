import config from 'signal/config';
import knex from 'knex';
import log from 'signal/utils/log';

export const db = knex(config.knex);
db.on('query', ({sql}) => log.info(`SQL ${sql}`));
