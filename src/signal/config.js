import _ from 'underscore';

const ENV = process.env;

var REQUIRED = [
  'KEY',
  'PORT',
  'POSTGRES_URL'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  key: ENV.KEY,
  port: ENV.PORT,
  log: {name: 'signal'},
  mail: {
    enabled: ENV.MAIL_ENABLED != '0',
    from: {
      name: ENV.MAIL_FROM_NAME,
      address: ENV.MAIL_FROM_ADDRESS
    }
  },
  knex: {
    client: 'postgresql',
    connection: ENV.POSTGRES_URL,
    pool: {min: 2, max: 10},
    migrations: {tableName: 'migrations'}
  }
};
