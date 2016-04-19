import _ from 'underscore';
import shared from '../shared/config';

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
  knex: {client: 'pg', connection: ENV.POSTGRES_URL},
  verifyKeyMaxAge: '1 hour',
  authKeyMaxAge: '60 days',
  maxUserNameLength: 16
};
