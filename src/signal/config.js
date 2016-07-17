import _ from 'underscore';
import shared from '../shared/config';

const ENV = process.env;

export default {
  ...shared,
  client: {
    url: ENV.CLIENT_URL
  },
  regions: _.map(ENV.REGION_URLS.split(','), url => ({url})),
  key: ENV.KEY,
  knex: {client: 'pg', connection: ENV.POSTGRES_URL},
  log: {name: 'signal'},
  mail: {
    enabled: ENV.MAIL_ENABLED !== '0',
    from: {
      name: ENV.MAIL_FROM_NAME,
      address: ENV.MAIL_FROM_ADDRESS
    }
  },
  maxUserNameLength: 16,
  verifyKeyMaxAge: '1 hour'
};
