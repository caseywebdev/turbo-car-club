import _ from 'underscore';
import shared from 'shared/config';

const ENV = process.env;

var REQUIRED = [
  'CLIENT_URL',
  'KEY',
  'POSTGRES_URL'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  ...shared,
  log: {name: 'signal'},
  client: {
    url: ENV.CLIENT_URL
  },
  mail: {
    enabled: ENV.MAIL_ENABLED != '0',
    from: {
      name: ENV.MAIL_FROM_NAME,
      address: ENV.MAIL_FROM_ADDRESS
    }
  },
  key: ENV.KEY,
  knex: {
    client: 'postgresql',
    connection: ENV.POSTGRES_URL,
    pool: {min: 2, max: 10},
    migrations: {tableName: 'migrations'}
  },
  verifyKeyTtl: 1000 * 60 * 60,
  authKeyTtl: 1000 * 60 * 60 * 24 * 60,
  maxUserNameLength: 16
};
