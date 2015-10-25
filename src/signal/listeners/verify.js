import _ from 'underscore';
import * as app from 'signal';
import async from 'async';
import config from 'signal/config';
import findOrCreateUser from 'signal/utils/find-or-create-user';
import log from 'signal/utils/log';
import sign from 'shared/utils/sign';
import updateSignedInAt from 'signal/utils/update-signed-in-at';
import verify from 'shared/utils/verify';

const {
  key,
  errors: {invalidKey, keyExpired, unknown},
  verifyKeyTtl
} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'verify', signed, verifyKeyTtl);
  if (!data) return cb(invalidKey);
  async.waterfall([
    _.partial(findOrCreateUser, {email_address: data.emailAddress}),
    (user, _cb) => {
      if (user.signed_in_at.toISOString() !== data.signedInAt) {
        return cb(keyExpired);
      }
      updateSignedInAt(user.id, _cb);
    }
  ], (er, user) => {
    if (er) {
      log.error(er);
      return cb(unknown);
    }
    const auth = sign(key, 'auth', {userId: user.id});
    const origin = app.live.sockets[data.socketId];
    if (origin && origin !== socket) origin.send('auth', auth);
    cb(null, auth);
  });
};
