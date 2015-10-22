import * as app from 'signal';
// import async from 'async';
import config from 'signal/config';
import verify from 'shared/utils/verify';

const INVALID_TOKEN = new Error('Invalid token');
const TOKEN_EXPIRED = new Error('Token expired');

export default (socket, token, cb) => {
  token = verify(config.key, token);
  if (!token) return cb(INVALID_TOKEN);

  const {emailAddress, expiresAt, type, userId} = token;
  if (!emailAddress || !expiresAt || type !== 'verify' || !userId) {
    return cb(INVALID_TOKEN);
  }

  if (Date.now() > new Date(expiresAt)) return cb(TOKEN_EXPIRED);

  app.knex('email_addresses')
    .insert({email_address: emailAddress, user_id: userId});
  // async.waterfall([
  //   cb =>
  //     app.knex.db
  //       .select('*')
  //       .from('users')
  //       .where({id: userId})
  //       .asCallback(cb),
  //   ([user], cb) => {
  //     if (!user) return cb(INVALID_TOKEN);
  //   }
  // ], cb);
};
