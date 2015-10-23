import * as app from 'signal';
import config from 'signal/config';
import log from 'signal/utils/log';
import verify from 'shared/utils/verify';

const {key, errors: {invalidKey, unknown}} = config;

export default (socket, signed, cb) => {
  const data = verify(key, signed);
  if (!data || data.type !== 'auth') return cb(invalidKey);
  app.knex.db
    .select('*')
    .from('users')
    .where({id: data.userId})
    .asCallback((er, [user]) => {
      if (er) {
        log.error(er);
        return cb(unknown);
      }
      if (!user) return cb(invalidKey);
      cb(null, user);
    });
};
