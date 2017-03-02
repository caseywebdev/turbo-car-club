import shared from '../shared/config';

const {env} = process;

export default {
  ...shared,
  client: {
    url: env.CLIENT_URL
  },
  key: env.KEY,
  knex: {client: 'pg', connection: env.POSTGRES_URL},
  log: {name: 'signal'},
  mail: {
    enabled: env.MAIL_ENABLED !== '0',
    from: {
      name: env.MAIL_FROM_NAME,
      address: env.MAIL_FROM_ADDRESS
    }
  },
  maxUserNameLength: 16,
  verifyKeyMaxAge: '1 hour'
};
