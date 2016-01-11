import _ from 'underscore';
import app from '..';
import async from 'async';
import config from '../config';
import findOrCreateUser from '../utils/find-or-create-user';
import log from '../utils/log';
import sign from '../../shared/utils/sign';
import updateSignedInAt from '../utils/update-signed-in-at';
import verify from '../../shared/utils/verify';

const {
  key,
  errors: {invalidKey, unknown},
  verifyKeyTtl
} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'verify', signed, verifyKeyTtl);
  if (!data) return cb(invalidKey);
  const {emailAddress} = data;
  async.waterfall([
    _.partial(findOrCreateUser, {emailAddress}),
    ({id, signedInAt}, _cb) => {
      if (signedInAt) signedInAt = signedInAt.toISOString();
      if (signedInAt !== data.signedInAt) return cb(invalidKey);
      updateSignedInAt(id, _cb);
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
