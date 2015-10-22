import * as app from 'signal';
import config from 'shared/config';
import verify from 'shared/utils/verify';

export default (socket, auth, cb) => {
  auth = verify(config.key, auth);
  if (auth && auth.expiresAt > (new Date()).toISOString()) {
    app.knex.db
      .select('*')
      .from('users')
      .where({id: auth.userId})
      .asCallback((er, [user]) => cb(er, user));
  }
};
